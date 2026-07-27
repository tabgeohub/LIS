type AuthMeUser = {
  sub?: string;
  username?: string;
  email?: string;
};

type AuthMeData = {
  pendingClientPath?: string;
  user?: AuthMeUser;
  roles?: { realm?: string[] };
};

export type AuthMeBootstrapUser = {
  role: string | undefined;
  user_id: string;
  user_name: string | undefined;
  email: string | undefined;
};

const ROLE_MARKERS = ["RWS ", "EXT ", "admin"] as const;

function matchesAppRole(item: string): boolean {
  return ROLE_MARKERS.some((marker) => item.includes(marker));
}

function pickAppRole(realmRoles: string[] | undefined): string | undefined {
  return realmRoles?.find(matchesAppRole);
}

function hasAuthUser(data: AuthMeData | null | undefined): data is AuthMeData & {
  user: AuthMeUser & { sub: string };
} {
  return Boolean(data?.user?.sub);
}

export function applyAuthMeBootstrap(
  data: AuthMeData | null | undefined,
  handlers: {
    setPendingClientPath: (path: string) => void;
    setUser: (user: AuthMeBootstrapUser) => void;
  }
): void {
  if (data?.pendingClientPath) {
    handlers.setPendingClientPath(data.pendingClientPath);
  }

  if (!hasAuthUser(data)) return;

  handlers.setUser({
    role: pickAppRole(data.roles?.realm),
    user_id: data.user.sub,
    user_name: data.user.username,
    email: data.user.email,
  });
}
