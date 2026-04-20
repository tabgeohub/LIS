import type { RequestHandler } from "express";
import { getSessionRole, isSessionAdmin } from "./sessionRole";

/**
 * Enforces server-side regio scoping:
 * - admin: unrestricted
 * - non-admin: req.query.regio(_id) and req.body.regio(_id) are forced to session role
 */
export const enforceRegioScope: RequestHandler = (req, res, next) => {
  if (isSessionAdmin(req)) {
    next();
    return;
  }

  const role = getSessionRole(req);
  if (!role) {
    res.status(403).json({
      message: "Forbidden: no authorized region role found",
    });
    return;
  }

  const query = { ...(req.query || {}) } as Record<string, any>;
  query.regio = role;
  query.regio_id = role;
  req.query = query;

  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    const body = { ...req.body } as Record<string, any>;
    body.regio = role;
    body.regio_id = role;
    req.body = body;
  }

  next();
};
