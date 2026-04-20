import type { RequestHandler } from "express";

export const requireSessionAuth: RequestHandler = (req, res, next) => {
  if (!req.session?.auth?.tokenSet?.access_token) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  next();
};
