import type { Request, Response } from "express";
import { pool } from "../../db";
import { denyMissingPlanIdentity, denyPlanRegion, hasPlanRegionAccess, resolvePlanPrincipal } from "./planAccess";
import { claimPreparedPlan, readPlanClaim } from "./planClaims";

function planID(req: Request): string | null {
  const value = req.params.id;
  return typeof value === "string" && value.trim() ? value : null;
}

export async function getPreparedPlanClaim(req: Request, res: Response): Promise<void> {
  const id = planID(req);
  if (!id) { res.status(400).json({ code: "INVALID_PLAN_ID", message: "Flight plan id is required" }); return; }
  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    const readback = await readPlanClaim(pool, id, principal);
    if (!readback.plan) { res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" }); return; }
    if (!hasPlanRegionAccess(principal, readback.plan.regio_id)) { denyPlanRegion(res); return; }
    res.status(200).json({ plan_id: readback.plan.id, status: readback.plan.status, claim: readback.claim });
  } catch (error) {
    console.error("Error reading flight plan claim:", error);
    res.status(500).json({ code: "PLAN_CLAIM_READBACK_ERROR", message: "Unable to read flight plan claim" });
  }
}

export async function claimPreparedPlanHandler(req: Request, res: Response): Promise<void> {
  const id = planID(req);
  if (!id) { res.status(400).json({ code: "INVALID_PLAN_ID", message: "Flight plan id is required" }); return; }
  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    const row = (await pool.query<{ regio_id: string | null }>(
      "SELECT regio_id FROM lis.flightPlans WHERE id = $1", [id]
    )).rows[0];
    if (!row) { res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" }); return; }
    if (!hasPlanRegionAccess(principal, row.regio_id)) { denyPlanRegion(res); return; }
    const result = await claimPreparedPlan({ pool, planID: id, principal });
    if (result.kind === "missing") { res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" }); return; }
    if (result.kind === "unavailable") { res.status(409).json({ code: "PLAN_NOT_PREPARED", message: "Only prepared flight plans can be claimed" }); return; }
    if (result.kind === "conflict") {
      res.status(409).json({ code: "PLAN_CLAIM_CONFLICT", message: "Flight plan is claimed by another account", claim: result.claim });
      return;
    }
    res.status(200).json({ plan_id: result.plan!.id, status: result.plan!.status, claim: result.claim });
  } catch (error) {
    console.error("Error claiming flight plan:", error);
    res.status(500).json({ code: "PLAN_CLAIM_ERROR", message: "Unable to claim flight plan; read claim status before retrying" });
  }
}
