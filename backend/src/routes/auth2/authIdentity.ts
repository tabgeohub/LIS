import type { TokenSet, UserinfoResponse } from "openid-client";
import type { Queryable } from "../../helpers/repositories/queryable";
import {
  isAdminRegioValue,
  pickRegioRoleFromRealmRoles,
} from "../../helpers/queries/shared/resolveRegioFilter";
import { decodeJwtPayload } from "../auth/jwt";

export type Auth2Identity = {
  /** Numeric LIS database identifier, never inferred from an OIDC subject. */
  user_id: number;
  /** Existing LIS region-role value, or null when the account has no region role. */
  regio_id: string | null;
  is_admin: boolean;
};

type TokenClaims = {
  realm_access?: { roles?: unknown };
};

type AuthIdentityTokenSet = Pick<TokenSet, "access_token" | "claims">;

function defaultDatabase(): Queryable {
  // Loading the pool lazily keeps header/validator-only paths and local mocked
  // tests from opening a database connection. Production identity resolution
  // still uses the shared application pool.
  return (require("../../db") as { pool: Queryable }).pool;
}

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
 * Resolves the numeric LIS user record from the authenticated Keycloak account
 * name. Display names and JWT `sub` are intentionally never used as a mapping
 * source: neither is the LIS database user identifier.
 */
export async function resolveAuthenticatedIdentity(input: {
  tokenSet: AuthIdentityTokenSet;
  userInfo: Pick<UserinfoResponse, "preferred_username" | "email">;
  db?: Queryable;
}): Promise<Auth2Identity | null> {
  const username = canonicalAuthenticatedUsername(input.userInfo);
  if (!username) return null;

  const result = await (input.db ?? defaultDatabase()).query(
    `SELECT user_id FROM lis.users
     WHERE LOWER(user_name) = LOWER($1)
     LIMIT 1`,
    [username]
  );
  const candidate = result.rows[0]?.user_id;
  const userId = typeof candidate === "number" ? candidate : Number(candidate);
  if (!Number.isSafeInteger(userId) || userId <= 0) return null;

  const regio_id = pickRegioRoleFromRealmRoles(
    realmRolesFromTokenSet(input.tokenSet)
  );
  return {
    user_id: userId,
    regio_id: regio_id ?? null,
    is_admin: isAdminRegioValue(regio_id),
  };
}

export class Auth2IdentityNotLinkedError extends Error {
  constructor() {
    super("Authenticated account is not linked to a LIS user");
    this.name = "Auth2IdentityNotLinkedError";
  }
}

export function requireLinkedIosIdentity(
  isIosRequest: boolean,
  identity: Auth2Identity | null
): void {
  if (isIosRequest && !identity) {
    throw new Auth2IdentityNotLinkedError();
  }
}

export function isAuth2IdentityNotLinkedError(
  error: unknown
): error is Auth2IdentityNotLinkedError {
  return error instanceof Auth2IdentityNotLinkedError;
}
