import type { Request, Response } from "express";
import { validateFinishedPlan } from "../../helpers/validators/finishedPlan";
import { resolvePlanPrincipal } from "../flightPlans/planAccess";
import { readFinishedPlanReceipt, submitFinishedPlanIdempotently, validateFinishedPlanSubmitInput } from "./iosFinishedPlanOperations";

function status(result: string): number {
  return ({ not_found: 404, forbidden: 403, unclaimed: 409, not_prepared: 409, conflict: 409, schema_required: 503 } as Record<string, number>)[result] || 503;
}
function sendIOSFinishedPlanResult(res: Response, result: Awaited<ReturnType<typeof submitFinishedPlanIdempotently>>): void {
  if (result.kind === "confirmed") { res.status(200).json({ planId: result.receipt.planId, receipt: result.receipt }); return; }
  // This is advisory only. The recovery endpoint locks and checks the same
  // business rows again before it writes anything.
  if (result.kind === "recovery_eligible") { res.status(200).json({ outcome: "recovery_eligible" }); return; }
  res.status(result.kind === "pending" ? 202 : status(result.kind)).json({ code: `FINISHED_PLAN_${result.kind.toUpperCase()}`, message: "Finished-plan submission was not accepted" });
}
export async function postIOSFinishedPlan(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE", message: "A Keycloak plan identity is required" }); return; }
  const input = validateFinishedPlanSubmitInput(req.body);
  const legacy = input && validateFinishedPlan({ plan: input.plan });
  if (!input || !legacy?.ok) { res.status(400).json({ code: "FINISHED_PLAN_OPERATION_INVALID", message: "Invalid package or finished-plan payload" }); return; }
  try {
    const result = await submitFinishedPlanIdempotently(input, principal);
    sendIOSFinishedPlanResult(res, result);
  } catch (error) { res.locals.uploadError = error; res.status(503).json({ code: "FINISHED_PLAN_UNAVAILABLE", message: "Finished-plan submission could not be reconciled" }); }
}
export async function getIOSFinishedPlanReceipt(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE", message: "A Keycloak plan identity is required" }); return; }
  const receipt = await readFinishedPlanReceipt(req.params.operationKey, principal);
  if (!receipt) { res.status(202).json({ code: "FINISHED_PLAN_PROJECTION_REQUIRED", message: "Reconcile the frozen projection; no persistent operation receipt exists" }); return; }
  res.status(200).json({ planId: receipt.planId, receipt });
}
export async function reconcileIOSFinishedPlan(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE" }); return; }
  const input = validateFinishedPlanSubmitInput(req.body);
  if (!input) { res.status(400).json({ code: "FINISHED_PLAN_OPERATION_INVALID" }); return; }
  try {
    const result = await submitFinishedPlanIdempotently(input, principal, undefined, true);
    sendIOSFinishedPlanResult(res, result);
  } catch (error) { res.locals.uploadError = error; res.status(503).json({ code: "FINISHED_PLAN_UNAVAILABLE" }); }
}
/**
 * Explicit user-authorised recovery for an already frozen iOS request. This
 * is deliberately separate from submit: a client must reconcile first and
 * may issue this write only once in its delivery pass.
 */
export async function recoverIOSFinishedPlan(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE" }); return; }
  const input = validateFinishedPlanSubmitInput(req.body);
  const legacy = input && validateFinishedPlan({ plan: input.plan });
  if (!input || !legacy?.ok) { res.status(400).json({ code: "FINISHED_PLAN_OPERATION_INVALID" }); return; }
  try {
    sendIOSFinishedPlanResult(res, await submitFinishedPlanIdempotently(input, principal));
  } catch (error) { res.locals.uploadError = error; res.status(503).json({ code: "FINISHED_PLAN_UNAVAILABLE", message: "Finished-plan recovery could not be completed" }); }
}
