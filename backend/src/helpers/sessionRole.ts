import { decodeJwtPayload } from "../routes/auth/jwt";

type SessionAuth = {
  tokenSet?: {
    access_token?: string;
    claims?: () => Record<string, any>;
  };
};

function extractRealmRoles(auth?: SessionAuth): string[] {
  const idClaims = auth?.tokenSet?.claims?.() ?? {};
  const accessClaims = decodeJwtPayload<any>(auth?.tokenSet?.access_token);
  const roles = accessClaims?.realm_access?.roles ?? idClaims?.realm_access?.roles;
  return Array.isArray(roles) ? roles : [];
}

export function getSessionRole(req: any): string | null {
  const roles = extractRealmRoles(req?.session?.auth);
  const matchedRole = roles.find((role) => {
    const value = String(role || "");
    return (
      value.includes("RWS ") ||
      value.includes("EXT ") ||
      value.toLowerCase().includes("admin")
    );
  });

  return matchedRole ?? null;
}

export function isSessionAdmin(req: any): boolean {
  const role = getSessionRole(req);
  return !!role && role.toLowerCase().includes("admin");
}
