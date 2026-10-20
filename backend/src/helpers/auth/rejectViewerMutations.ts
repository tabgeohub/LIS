import type { RequestHandler } from "express";
import { isViewerOnlySession } from "./resolveSessionAffiliation";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Blocks create / update / delete for intern (viewer-only) sessions.
 * Must run after session auth so realm roles are available.
 */
export const rejectViewerMutations: RequestHandler = (req, res, next) => {
  if (SAFE_METHODS.has(req.method.toUpperCase())) {
    next();
    return;
  }

  if (!isViewerOnlySession(req)) {
    next();
    return;
  }

  res.status(403).json({
    message:
      "U heeft alleen leesrechten (intern). Wijzigingen zijn niet toegestaan.",
    code: "VIEWER_ONLY",
  });
};
