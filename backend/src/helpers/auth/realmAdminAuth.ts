import type { Request, RequestHandler } from "express";
import { decodeJwtPayload } from "../../routes/auth/jwt";

type AccessClaims = {
  realm_access?: {
    roles?: string[];
  };
};

export function getRealmRoles(req: Request): string[] {
  const token = req.session?.auth?.tokenSet?.access_token;
  const claims = decodeJwtPayload<AccessClaims>(token);
  return claims?.realm_access?.roles ?? [];
}

export function isAdmin(req: Request): boolean {
  return getRealmRoles(req).some((role) => role.toLowerCase().includes("admin"));
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(403).json({ error: "Admin role required" });
    return;
  }
  next();
};

export function createRequireAdmin(errorMessage: string): RequestHandler {
  return (req, res, next) => {
    if (!isAdmin(req)) {
      res.status(403).json({ error: errorMessage });
      return;
    }
    next();
  };
}
