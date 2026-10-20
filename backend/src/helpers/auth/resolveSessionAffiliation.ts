import type { Request } from "express";
import { getSessionRealmRoles } from "../queries/shared/resolveRegioFilter";

export type SessionAffiliation = "intern" | "extern" | null;

function normalize(role: string): string {
  return role.trim().toLowerCase();
}

function isAdminRealmRole(role: string): boolean {
  return normalize(role) === "admin";
}

function isRwsRegionRole(role: string): boolean {
  const trimmed = role.trim();
  return (
    /^RWS([\s_].*)?$/i.test(trimmed) ||
    trimmed.toUpperCase().startsWith("RWS ")
  );
}

function isExternRealmRole(role: string): boolean {
  if (isRwsRegionRole(role) || isAdminRealmRole(role)) return false;
  const n = normalize(role);
  if (n === "extern" || n === "ext") return true;
  const upper = role.trim().toUpperCase();
  return upper.startsWith("EXT ") || upper.startsWith("EXT_");
}

function isInternRealmRole(role: string): boolean {
  if (isRwsRegionRole(role) || isAdminRealmRole(role)) return false;
  return normalize(role) === "intern";
}

/** Same rules as frontend resolveAuthUserFromRealmRoles (affiliation only). */
export function resolveAffiliationFromRealmRoles(
  realmRoles: string[]
): SessionAffiliation {
  if (realmRoles.some(isAdminRealmRole)) return null;
  const hasRegion = realmRoles.some(isRwsRegionRole);
  if (!hasRegion) return null;
  if (realmRoles.some(isExternRealmRole)) return "extern";
  if (realmRoles.some(isInternRealmRole)) return "intern";
  return null;
}

export function getSessionAffiliation(req: Request): SessionAffiliation {
  return resolveAffiliationFromRealmRoles(getSessionRealmRoles(req));
}

export function isViewerOnlySession(req: Request): boolean {
  return getSessionAffiliation(req) === "intern";
}
