import type { RequestHandler } from "express";
import { ensureFreshSession } from "./ensureFreshSession";

export const requireSessionAuth: RequestHandler = async (req, res, next) => {
  const result = await ensureFreshSession(req);

  if (!result.ok || !req.session?.auth?.tokenSet?.access_token) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  next();
};
