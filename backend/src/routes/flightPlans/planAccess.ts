import type { Request, Response } from "express";
import { resolveAuthenticatedIdentity, type Auth2Identity } from "../auth2/authIdentity";
import { pool } from "../../db";

export type PlanPrincipal = Auth2Identity;

/**
 * Resolves only a Keycloak-derived identity already held by the authenticated
 * server session.  It deliberately never accepts a request-body user/region.
 */
export async function resolvePlanPrincipal(req: Request): Promise<PlanPrincipal | null> {
  const auth = (req.session as unknown as { auth?: { tokenSet?: Parameters<typeof resolveAuthenticatedIdentity>[0]["tokenSet"]; userInfo?: Parameters<typeof resolveAuthenticatedIdentity>[0]["userInfo"] } })?.auth;
  if (!auth) return null;
  if (!auth.tokenSet || !auth.userInfo) return null;
  return resolveAuthenticatedIdentity({ tokenSet: auth.tokenSet, userInfo: auth.userInfo });
}

export function hasPlanRegionAccess(principal: PlanPrincipal, regioID: unknown): boolean {
  if (principal.is_admin) return true;
  return typeof regioID === "string" && principal.regio_id === regioID;
}

export function denyMissingPlanIdentity(res: Response): void {
  res.status(403).json({ code: "PLAN_IDENTITY_UNAVAILABLE", message: "A Keycloak plan identity is required" });
}

export function denyPlanRegion(res: Response): void {
  res.status(403).json({ code: "PLAN_REGION_FORBIDDEN", message: "Flight plan is outside the authenticated region" });
}

/** Authorize a body-supplied target region before creating an entity. */
export async function authorizeCreateRegion(req: Request, res: Response, regioID: unknown): Promise<boolean> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { denyMissingPlanIdentity(res); return false; }
  if (typeof regioID !== "string" || !regioID.trim() || !hasPlanRegionAccess(principal, regioID)) { denyPlanRegion(res); return false; }
  return true;
}

/** Authorize every mutation through the persisted parent flight. */
export async function authorizeFlightPlan(req: Request, res: Response, planID: unknown): Promise<boolean> {
  const principal = await resolvePlanPrincipal(req);
  if (!principal) { denyMissingPlanIdentity(res); return false; }
  const result = await pool.query<{ regio_id: string | null }>("SELECT regio_id FROM lis.flightplans WHERE id=$1", [planID]);
  if (!result.rows[0]) { res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" }); return false; }
  if (!hasPlanRegionAccess(principal, result.rows[0].regio_id)) { denyPlanRegion(res); return false; }
  return true;
}
