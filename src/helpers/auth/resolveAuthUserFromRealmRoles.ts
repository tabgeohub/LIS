import type { UserAffiliation } from "Types";

export type ResolvedAuthRoles = {
  /** Region role (e.g. `RWS NN`) or `admin` — used for regio filtering. */
  role: string | undefined;
  /** Companion marker: RWS + extern/intern. Null for admin-only or RWS-only. */
  affiliation: UserAffiliation;
};

function normalize(role: string): string {
  return role.trim().toLowerCase();
}

export function isAdminRealmRole(role: string): boolean {
  return normalize(role) === "admin";
}

/** Region roles: `RWS …` / `RWS_…` (not companion markers). */
export function isRwsRegionRole(role: string): boolean {
  const trimmed = role.trim();
  return /^RWS([\s_].*)?$/i.test(trimmed) || trimmed.toUpperCase().startsWith("RWS ");
}

/**
 * Companion "extern" role.
 * Accepts exact `extern` / `ext`, and legacy `EXT …` / `EXT_…` names
 * that are not RWS region roles.
 */
export function isExternRealmRole(role: string): boolean {
  if (isRwsRegionRole(role) || isAdminRealmRole(role)) return false;
  const n = normalize(role);
  if (n === "extern" || n === "ext") return true;
  const upper = role.trim().toUpperCase();
  return upper.startsWith("EXT ") || upper.startsWith("EXT_");
}

/** Companion "intern" role (exact name). */
export function isInternRealmRole(role: string): boolean {
  if (isRwsRegionRole(role) || isAdminRealmRole(role)) return false;
  return normalize(role) === "intern";
}

/**
 * Resolve app role + affiliation from Keycloak realm roles.
 *
 * - `admin` alone → role admin
 * - `RWS_{region}` alone → role = region
 * - `RWS_{region}` + extern → role = region, affiliation = extern
 * - `RWS_{region}` + intern → role = region, affiliation = intern
 *
 * Admin wins if present. Extern wins over intern if both companion roles exist.
 */
export function resolveAuthUserFromRealmRoles(
  realmRoles: string[] | undefined
): ResolvedAuthRoles {
  const roles = (realmRoles ?? []).map((r) => r.trim()).filter(Boolean);

  if (roles.some(isAdminRealmRole)) {
    return { role: "admin", affiliation: null };
  }

  const region = roles.find(isRwsRegionRole);
  if (!region) {
    return { role: undefined, affiliation: null };
  }

  if (roles.some(isExternRealmRole)) {
    return { role: region, affiliation: "extern" };
  }
  if (roles.some(isInternRealmRole)) {
    return { role: region, affiliation: "intern" };
  }

  return { role: region, affiliation: null };
}
