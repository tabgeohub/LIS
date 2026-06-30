import type { Session } from "express-session";
import { decodeJwtPayload } from "../jwt";
import { consumePendingClientRedirect } from "./resolvePostLoginRedirect";

type SessionWithPending = Session & { pendingClientPath?: string };

type TokenClaims = Record<string, any>;

type AuthSession = {
  tokenSet?: {
    access_token?: string;
    claims?: () => TokenClaims;
  };
  userInfo?: {
    preferred_username?: string;
    email?: string;
    name?: string;
  };
};

export function unauthenticatedMeBody() {
  return { user: null, roles: { realm: [], resource: {} } };
}

function resolveUsername(
  auth: AuthSession,
  idClaims: TokenClaims,
  accessClaims: TokenClaims | null
): string | null {
  return (
    idClaims.preferred_username ??
    accessClaims?.preferred_username ??
    auth.userInfo?.preferred_username ??
    auth.userInfo?.email ??
    null
  );
}

function resolveRealmRoles(
  idClaims: TokenClaims,
  accessClaims: TokenClaims | null
): string[] {
  return accessClaims?.realm_access?.roles ?? idClaims?.realm_access?.roles ?? [];
}

function resolveResourceRoles(
  idClaims: TokenClaims,
  accessClaims: TokenClaims | null
): Record<string, unknown> {
  return accessClaims?.resource_access ?? idClaims?.resource_access ?? {};
}

function buildMeUser(
  auth: AuthSession,
  idClaims: TokenClaims,
  accessClaims: TokenClaims | null
) {
  return {
    username: resolveUsername(auth, idClaims, accessClaims),
    name: auth.userInfo?.name ?? idClaims.name ?? null,
    email: auth.userInfo?.email ?? idClaims.email ?? null,
    sub: idClaims.sub ?? accessClaims?.sub ?? null,
  };
}

export function buildAuthenticatedMeBody(
  session: SessionWithPending,
  auth: AuthSession
) {
  const idClaims = auth.tokenSet?.claims?.() ?? {};
  const accessClaims = decodeJwtPayload<TokenClaims>(
    auth.tokenSet?.access_token ?? ""
  );
  const pendingClientPath = consumePendingClientRedirect(session);

  return {
    user: buildMeUser(auth, idClaims, accessClaims),
    roles: {
      realm: resolveRealmRoles(idClaims, accessClaims),
      resource: resolveResourceRoles(idClaims, accessClaims),
    },
    ...(pendingClientPath ? { pendingClientPath } : {}),
    raw: {
      idToken: idClaims,
    },
  };
}
