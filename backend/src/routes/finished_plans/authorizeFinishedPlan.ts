import type { Request, Response } from "express";
import { pool } from "../../db";
import { denyMissingPlanIdentity, denyPlanRegion, hasPlanRegionAccess, resolvePlanPrincipal } from "../flightPlans/planAccess";

/** Authorize reads against the parent flight rather than a caller-supplied region. */
export async function authorizeFinishedPlan(req: Request, res: Response, planId: unknown): Promise<boolean> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { denyMissingPlanIdentity(res); return false; }
  const result = await pool.query<{ regio_id: string | null }>(
    "SELECT regio_id FROM lis.flightPlans WHERE id = $1", [planId]
  );
  if (!result.rows[0]) {
    res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" });
    return false;
  }
  if (!hasPlanRegionAccess(principal, result.rows[0].regio_id)) { denyPlanRegion(res); return false; }
  return true;
}
