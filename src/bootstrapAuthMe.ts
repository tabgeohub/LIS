import type { UserType } from "Types";
import { resolveAuthUserFromRealmRoles } from "helpers/auth/resolveAuthUserFromRealmRoles";

type AuthMePayload = {
  pendingClientPath?: string;
  roles: { realm: string[] };
  user: { sub: string; username: string; email?: string };
};

function hasAuthMeUser(
  data: AuthMePayload | null | undefined
): data is AuthMePayload {
  return Boolean(data && data.user && data.user.sub);
}

export function buildAuthUserFromMe(data: AuthMePayload): UserType {
  const { role, affiliation } = resolveAuthUserFromRealmRoles(data.roles.realm);
  return {
    role: role as string,
    affiliation,
    user_id: data.user.sub as unknown as number,
    user_name: data.user.username,
    email: data.user.email,
  };
}

export function applyAuthMeBootstrap(
  data: AuthMePayload | null | undefined,
  handlers: {
    setPendingClientPath: (path: string) => void;
    setUser: (user: UserType) => void;
  }
): void {
  if (data?.pendingClientPath) {
    handlers.setPendingClientPath(data.pendingClientPath);
  }
  if (!hasAuthMeUser(data)) return;
  handlers.setUser(buildAuthUserFromMe(data));
}

/** @deprecated Prefer resolveAuthUserFromRealmRoles — kept for call-site compatibility. */
export function pickRealmRole(realmRoles: string[]): string | undefined {
  return resolveAuthUserFromRealmRoles(realmRoles).role;
}
