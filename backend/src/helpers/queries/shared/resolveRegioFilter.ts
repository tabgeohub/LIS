import { Request } from "express";
import { decodeJwtPayload } from "../../../routes/auth/jwt";

function firstQueryValue(value: unknown): string | undefined {
  if (value == null || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    const first = value[0];
    return first != null && first !== "" ? String(first) : undefined;
  }

  return String(value);
}

export function getSessionRealmRoles(req: Request): string[] {
  const auth = req.session?.auth;
  if (!auth?.tokenSet?.access_token) {
    return [];
  }

  const idClaims =
    typeof auth.tokenSet.claims === "function" ? auth.tokenSet.claims() : {};
  const accessClaims = decodeJwtPayload<{
    realm_access?: { roles?: string[] };
  }>(auth.tokenSet.access_token);

  return (
    accessClaims?.realm_access?.roles ??
    (idClaims as { realm_access?: { roles?: string[] } })?.realm_access
      ?.roles ??
    []
  );
}

/** Matches frontend App.tsx role selection. */
export function pickRegioRoleFromRealmRoles(
  roles: string[]
): string | undefined {
  return roles.find(
    (item) =>
      item.includes("RWS ") ||
      item.includes("EXT ") ||
      item.toLowerCase() === "admin"
  );
}

export function isAdminRegioValue(regio: unknown): boolean {
  if (regio == null || regio === "") {
    return false;
  }

  return regio.toString().toLowerCase() === "admin";
}

/**
 * Effective regio for read/query filtering.
 * - Non-admin: always session role (query cannot widen access).
 * - Admin: optional regio_id/regio query param to filter; omit for all regios.
 */
export function resolveRegioFilter(req: Request): string | undefined {
  const sessionRegio = pickRegioRoleFromRealmRoles(getSessionRealmRoles(req));
  const queryRegio =
    firstQueryValue(req.query.regio_id) ?? firstQueryValue(req.query.regio);

  if (sessionRegio && !isAdminRegioValue(sessionRegio)) {
    return sessionRegio;
  }

  if (queryRegio) {
    return queryRegio;
  }

  return sessionRegio;
}
