import type { UserType } from "Types";

const ROLE_MARKERS = ["RWS ", "EXT ", "admin"] as const;

type AuthMePayload = {
  pendingClientPath?: string;
  roles: { realm: string[] };
  user: { sub: string; username: string; email?: string };
};

function roleMatchesMarker(item: string): boolean {
  return ROLE_MARKERS.some((marker) => item.includes(marker));
}

export function pickRealmRole(realmRoles: string[]): string | undefined {
  return realmRoles.find(roleMatchesMarker);
}

function hasAuthMeUser(data: AuthMePayload | null | undefined): data is AuthMePayload {
  return Boolean(data && data.user && data.user.sub);
}

export function buildAuthUserFromMe(data: AuthMePayload): UserType {
  return {
    role: pickRealmRole(data.roles.realm) as string,
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
