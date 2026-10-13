import type { Request, Response } from "express";
import { validateFinishedPlan } from "../../helpers/validators/finishedPlan";
import { resolvePlanPrincipal } from "../flightPlans/planAccess";
import { readFinishedPlanReceipt, submitFinishedPlanIdempotently, validateFinishedPlanSubmitInput } from "./iosFinishedPlanOperations";

function status(result: string): number {
  return ({ not_found: 404, forbidden: 403, unclaimed: 409, not_prepared: 409, conflict: 409, schema_required: 503 } as Record<string, number>)[result] || 503;
}
export async function postIOSFinishedPlan(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE", message: "A Keycloak plan identity is required" }); return; }
  const input = validateFinishedPlanSubmitInput(req.body);
  const legacy = input && validateFinishedPlan({ plan: input.plan });
  if (!input || !legacy?.ok) { res.status(400).json({ code: "FINISHED_PLAN_OPERATION_INVALID", message: "Invalid package or finished-plan payload" }); return; }
  try {
    const result = await submitFinishedPlanIdempotently(input, principal);
    if (result.kind === "confirmed") { res.status(200).json({ planId: result.receipt.planId, receipt: result.receipt }); return; }
    res.status(result.kind === "pending" ? 202 : status(result.kind)).json({ code: `FINISHED_PLAN_${result.kind.toUpperCase()}`, message: "Finished-plan submission was not accepted" });
  } catch { res.status(503).json({ code: "FINISHED_PLAN_UNAVAILABLE", message: "Finished-plan submission could not be reconciled" }); }
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
    if (result.kind === "confirmed") { res.status(200).json({ planId: result.receipt.planId, receipt: result.receipt }); return; }
    res.status(result.kind === "pending" ? 202 : status(result.kind)).json({ code: `FINISHED_PLAN_${result.kind.toUpperCase()}` });
  } catch { res.status(503).json({ code: "FINISHED_PLAN_UNAVAILABLE" }); }
}
