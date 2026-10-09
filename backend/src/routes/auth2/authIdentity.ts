import type { TokenSet, UserinfoResponse } from "openid-client";
import {
  isAdminRegioValue,
  pickRegioRoleFromRealmRoles,
} from "../../helpers/queries/shared/resolveRegioFilter";
import { decodeJwtPayload } from "../auth/jwt";

export type Auth2Identity = {
  /** Verified Keycloak userinfo subject; independent of display name/username. */
  subject: string;
  /** Existing LIS region-role value, or null when the account has no region role. */
  regio_id: string | null;
  is_admin: boolean;
};

type TokenClaims = {
  realm_access?: { roles?: unknown };
};

type AuthIdentityTokenSet = Pick<TokenSet, "access_token" | "claims">;

function stringRoles(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((role): role is string => typeof role === "string");
}

export function realmRolesFromTokenSet(tokenSet: AuthIdentityTokenSet): string[] {
  const accessClaims = decodeJwtPayload<TokenClaims>(tokenSet.access_token || "");
  const accessRoles = stringRoles(accessClaims?.realm_access?.roles);
  if (accessRoles.length > 0) return accessRoles;

  const idClaims = typeof tokenSet.claims === "function" ? tokenSet.claims() : {};
  return stringRoles((idClaims as TokenClaims)?.realm_access?.roles);
}

export function canonicalAuthenticatedUsername(
  userInfo: Pick<UserinfoResponse, "preferred_username" | "email">
): string | null {
  const candidate = userInfo.preferred_username || userInfo.email;
  const normalized = typeof candidate === "string" ? candidate.trim() : "";
  return normalized || null;
}

/**
 * Consumes userinfo returned by the authenticated OIDC client after a successful
 * grant. Never takes account identity or roles from the incoming request body.
 */
export async function resolveAuthenticatedIdentity(input: {
  tokenSet: AuthIdentityTokenSet;
  userInfo: Partial<Pick<UserinfoResponse, "sub" | "preferred_username" | "email">>;
}): Promise<Auth2Identity | null> {
  const subject = input.userInfo.sub;
  if (typeof subject !== "string" || !subject.trim() || subject !== subject.trim()) return null;

  const regio_id = pickRegioRoleFromRealmRoles(
    realmRolesFromTokenSet(input.tokenSet)
  );
  return {
    subject,
    regio_id: regio_id ?? null,
    is_admin: isAdminRegioValue(regio_id),
  };
}

export class Auth2IdentityUnavailableError extends Error {
  constructor() {
    super("Authenticated Keycloak response is missing a valid subject");
    this.name = "Auth2IdentityUnavailableError";
  }
}

export function requireIosSubjectIdentity(
  isIosRequest: boolean,
  identity: Auth2Identity | null
): void {
  if (isIosRequest && !identity) {
    throw new Auth2IdentityUnavailableError();
  }
}

export function isAuth2IdentityUnavailableError(
  error: unknown
): error is Auth2IdentityUnavailableError {
  return error instanceof Auth2IdentityUnavailableError;
}
