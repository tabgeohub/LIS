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

/**
 * Assembles the /auth/me payload. Claim sources are held as fields so the
 * extraction methods take no parameters (keeps Sigrid unit-interfacing low).
 */
class MeResponseBuilder {
  private readonly auth: AuthSession;
  private readonly idClaims: TokenClaims;
  private readonly accessClaims: TokenClaims | null;

  constructor(auth: AuthSession) {
    this.auth = auth;
    this.idClaims = auth.tokenSet?.claims?.() ?? {};
    this.accessClaims = decodeJwtPayload<TokenClaims>(
      auth.tokenSet?.access_token ?? ""
    );
  }

  private username(): string | null {
    return (
      this.idClaims.preferred_username ??
      this.accessClaims?.preferred_username ??
      this.auth.userInfo?.preferred_username ??
      this.auth.userInfo?.email ??
      null
    );
  }

  private realmRoles(): string[] {
    return (
      this.accessClaims?.realm_access?.roles ??
      this.idClaims?.realm_access?.roles ??
      []
    );
  }

  private resourceRoles(): Record<string, unknown> {
    return this.accessClaims?.resource_access ?? this.idClaims?.resource_access ?? {};
  }

  private user() {
    return {
      username: this.username(),
      name: this.auth.userInfo?.name ?? this.idClaims.name ?? null,
      email: this.auth.userInfo?.email ?? this.idClaims.email ?? null,
      sub: this.idClaims.sub ?? this.accessClaims?.sub ?? null,
    };
  }

  build(pendingClientPath?: string) {
    return {
      user: this.user(),
      roles: {
        realm: this.realmRoles(),
        resource: this.resourceRoles(),
      },
      ...(pendingClientPath ? { pendingClientPath } : {}),
      raw: {
        idToken: this.idClaims,
      },
    };
  }
}

export function buildAuthenticatedMeBody(
  session: SessionWithPending,
  auth: AuthSession
) {
  const pendingClientPath = consumePendingClientRedirect(session);
  return new MeResponseBuilder(auth).build(pendingClientPath);
}
