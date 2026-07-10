import type { RequestHandler } from "express";
import { isAllowedAuthClient } from "./authClientHeader";
import { logAuthSecurityEvent } from "./authSecurityLog";

/**
 * When AUTH2_REQUIRE_CLIENT_HEADER=true, auth2 endpoints require X-LIS-Client: desktop.
 * Applied to verify-credentials, login, me, and logout for consistent client separation.
 */
export const requireAuthClientHeader: RequestHandler = (req, res, next) => {
  if (isAllowedAuthClient(req)) {
    next();
    return;
  }

  logAuthSecurityEvent(
    "auth2.client_header.rejected",
    { endpoint: req.path },
    req
  );

  res.status(403).json({
    success: false,
    code: "CLIENT_HEADER_REQUIRED",
    message: "Request not allowed",
  });
};
