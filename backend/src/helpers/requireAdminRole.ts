import type { RequestHandler } from "express";
import { isSessionAdmin } from "./sessionRole";

export const requireAdminRole: RequestHandler = (req, res, next) => {
  if (!isSessionAdmin(req)) {
    res.status(403).json({
      message: "Forbidden: admin role required",
    });
    return;
  }

  next();
};
