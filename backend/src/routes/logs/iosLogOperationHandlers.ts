import type { Request, Response } from "express";
import { resolvePlanPrincipal } from "../flightPlans/planAccess";
import { readIOSLogReceipt, submitIOSLogsIdempotently, validateIOSLogInput } from "./iosLogOperations";

function status(kind: string): number { return ({ forbidden: 403, plan_not_confirmed: 409, conflict: 409, schema_required: 503 } as Record<string, number>)[kind] || 503; }
export async function postIOSLogOperation(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "LOG_IDENTITY_UNAVAILABLE", message: "A Keycloak log identity is required" }); return; }
  const input = validateIOSLogInput(req.body);
  if (!input || input.operation_key !== req.params.operationKey) { res.status(400).json({ code: "LOG_OPERATION_INVALID", message: "Invalid immutable log package" }); return; }
  try {
    const result = await submitIOSLogsIdempotently(input, principal);
    if (result.kind === "confirmed") { res.status(200).json({ operation_key: input.operation_key, receipt: result.receipt }); return; }
    res.status(status(result.kind)).json({ code: `LOG_OPERATION_${result.kind.toUpperCase()}`, message: "Log operation was not accepted" });
  } catch { res.status(503).json({ code: "LOG_OPERATION_UNAVAILABLE", message: "Log operation could not be reconciled" }); }
}
export async function getIOSLogOperation(req: Request, res: Response): Promise<void> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { res.status(403).json({ code: "LOG_IDENTITY_UNAVAILABLE", message: "A Keycloak log identity is required" }); return; }
  const receipt = await readIOSLogReceipt(req.params.operationKey, principal);
  if (!receipt) { res.status(404).json({ code: "LOG_OPERATION_RECEIPT_NOT_FOUND", message: "Log receipt was not found" }); return; }
  res.status(200).json({ operation_key: req.params.operationKey, receipt });
}
