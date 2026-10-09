import type { Request, Response } from "express";
import { pool } from "../../db";
import { updateFlightPlanStatus as updateFlightPlanStatusRow } from "../../helpers/repositories/flightPlansRepo";
import { denyMissingPlanIdentity, denyPlanRegion, hasPlanRegionAccess, resolvePlanPrincipal } from "./planAccess";
import { requireOwnedClaimForStatus } from "./planClaims";

/** Keeps the established `{id,status}` route with region/claim enforcement. */
export async function updateFlightPlanStatus(req: Request, res: Response): Promise<void> {
  const { id, status } = req.body ?? {};
  if ((typeof id !== "string" && typeof id !== "number") || typeof status !== "string" || !status.trim()) {
    res.status(400).json({ code: "INVALID_STATUS_REQUEST", message: "id and status are required" });
    return;
  }
  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    const plan = (await pool.query<{ id: number; regio_id: string | null }>(
      "SELECT id, regio_id FROM lis.flightPlans WHERE id = $1", [id]
    )).rows[0];
    if (!plan) { res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" }); return; }
    if (!hasPlanRegionAccess(principal, plan.regio_id)) { denyPlanRegion(res); return; }
    if (!principal.is_admin) {
      const claim = await requireOwnedClaimForStatus({ db: pool, planID: id, principal });
      if (claim === "unclaimed") { res.status(409).json({ code: "PLAN_CLAIM_REQUIRED", message: "A current plan claim is required" }); return; }
      if (claim === "conflict") { res.status(409).json({ code: "PLAN_CLAIM_CONFLICT", message: "Flight plan is claimed by another account" }); return; }
      if (claim === "missing") { res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" }); return; }
    }
    const result = await updateFlightPlanStatusRow(pool, { id, status: status.trim() });
    res.status(200).json({ success: true, message: "Status van het vluchtplan succesvol bijgewerkt", result: result.rows[0] ?? null });
  } catch (error) {
    console.error("Fout bij het bijwerken van het vluchtplan:", error);
    res.status(500).json({ code: "PLAN_STATUS_ERROR", message: "Bijwerken van het vluchtplan mislukt" });
  }
}
