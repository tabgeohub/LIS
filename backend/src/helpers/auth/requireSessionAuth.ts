import type { RequestHandler, Response } from "express";
import { ensureFreshSession } from "./ensureFreshSession";

export function requireSessionAuthWithError(onUnauthorized: (res: Response) => void): RequestHandler {
  return async (req, res, next) => {
    const result = await ensureFreshSession(req);

    if (!result.ok || !req.session?.auth?.tokenSet?.access_token) {
      onUnauthorized(res);
      return;
    }

    next();
  };
}

export const requireSessionAuth = requireSessionAuthWithError((res) => {
  res.status(401).json({ message: "Authentication required" });
});
