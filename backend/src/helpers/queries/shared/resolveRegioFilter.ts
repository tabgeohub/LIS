import { Request } from "express";
import { decodeJwtPayload } from "../../../routes/auth/jwt";

function isBlankQueryValue(value: unknown): boolean {
  return value == null || value === "";
}

function firstArrayQueryValue(value: unknown[]): string | undefined {
  const first = value[0];
  if (isBlankQueryValue(first)) return undefined;
  return String(first);
}

function firstQueryValue(value: unknown): string | undefined {
  if (isBlankQueryValue(value)) return undefined;
  if (Array.isArray(value)) return firstArrayQueryValue(value);
  return String(value);
}

function rolesFromClaims(claims: unknown): string[] | undefined {
  return (claims as { realm_access?: { roles?: string[] } } | null)
    ?.realm_access?.roles;
}

function idTokenClaims(tokenSet: {
  claims?: () => unknown;
}): unknown {
  return typeof tokenSet.claims === "function" ? tokenSet.claims() : {};
}

function rolesFromAccessToken(accessToken: string): string[] | undefined {
  const accessClaims = decodeJwtPayload<{
    realm_access?: { roles?: string[] };
  }>(accessToken);
  return rolesFromClaims(accessClaims);
}

function rolesFromAccessOrIdToken(tokenSet: {
  access_token?: string;
  claims?: () => unknown;
}): string[] | undefined {
  const accessToken = tokenSet.access_token;
  if (!accessToken) return undefined;
  return (
    rolesFromAccessToken(accessToken) ??
    rolesFromClaims(idTokenClaims(tokenSet))
  );
}

function rolesFromTokenSet(tokenSet: {
  access_token?: string;
  claims?: () => unknown;
}): string[] {
  return rolesFromAccessOrIdToken(tokenSet) ?? [];
}

function resolveRealmRolesFromAuth(auth: {
  tokenSet: { access_token?: string; claims?: () => unknown };
}): string[] {
  if (!auth.tokenSet.access_token) return [];
  return rolesFromTokenSet(auth.tokenSet);
}

export function getSessionRealmRoles(req: Request): string[] {
  const auth = (req.session as unknown as { auth?: { tokenSet?: { access_token?: string; claims?: () => unknown } } })?.auth;
  if (!auth?.tokenSet?.access_token) return [];
  return rolesFromTokenSet(auth.tokenSet);
}

function isRwsOrExtRole(role: string): boolean {
  return role.startsWith("RWS ") || role.startsWith("EXT ");
}

function isAdminRoleName(role: string): boolean {
  return role === "admin";
}

/** Matches frontend App.tsx role selection. */
export function pickRegioRoleFromRealmRoles(
  roles: string[]
): string | undefined {
  if (roles.includes("admin")) return "admin";
  return roles.find(
    (item) => isRwsOrExtRole(item) || isAdminRoleName(item)
  );
}

export function isAdminRegioValue(regio: unknown): boolean {
  if (regio == null || regio === "") {
    return false;
  }

  return regio.toString().toLowerCase() === "admin";
}

function resolveNonAdminOrQueryRegio(input: {
  sessionRegio: string | undefined;
  queryRegio: string | undefined;
}): string | undefined {
  if (input.sessionRegio && !isAdminRegioValue(input.sessionRegio)) {
    return input.sessionRegio;
  }
  return input.queryRegio || input.sessionRegio;
}

/**
 * Effective regio for read/query filtering.
 * - Non-admin: always session role (query cannot widen access).
 * - Admin: optional regio_id/regio query param to filter; omit for all regios.
 */
export function resolveRegioFilter(req: Request): string | undefined {
  const roles = getSessionRealmRoles(req);
  const sessionRegio = pickRegioRoleFromRealmRoles(roles);
  const queryRegio =
    firstQueryValue(req.query.regio_id) ?? firstQueryValue(req.query.regio);

  if (!sessionRegio) return "__LIS_UNRECOGNIZED_REGION__";
  return resolveNonAdminOrQueryRegio({ sessionRegio, queryRegio });
}
