import type { Request, Response } from "express";
import { resolveAuthenticatedIdentity, type Auth2Identity } from "../auth2/authIdentity";

export type PlanPrincipal = Auth2Identity;

/**
 * Resolves only a Keycloak-derived identity already held by the authenticated
 * server session.  It deliberately never accepts a request-body user/region.
 */
export async function resolvePlanPrincipal(req: Request): Promise<PlanPrincipal | null> {
  const auth = req.session?.auth;
  if (!auth) return null;
  const identity = auth.identity;
  if (identity?.subject && typeof identity.regio_id !== "undefined") return identity;
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
