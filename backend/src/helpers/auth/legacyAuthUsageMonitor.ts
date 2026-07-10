import type { RequestHandler } from "express";
import { logAuthSecurityEvent } from "../../routes/auth2/authSecurityLog";

const LEGACY_AUTH_PATHS = new Set([
  "/auth/login-direct",
  "/auth/desktop-ok",
]);

/**
 * Logs usage of legacy auth endpoints for deprecation planning (L5).
 * Does not block requests — monitoring only.
 */
export const legacyAuthUsageMonitor: RequestHandler = (req, _res, next) => {
  const path = req.path;

  if (path === "/auth/login-direct" && req.method === "POST") {
    logAuthSecurityEvent(
      "auth.legacy.usage",
      { endpoint: path, method: req.method },
      req
    );
  }

  if (path === "/auth/login" && req.method === "GET") {
    const mode = String(req.query.mode || "").toLowerCase();
    if (mode === "desktop") {
      logAuthSecurityEvent(
        "auth.legacy.usage",
        { endpoint: path, method: req.method, mode: "desktop" },
        req
      );
    }
  }

  if (LEGACY_AUTH_PATHS.has(path) && req.method === "GET" && path !== "/auth/login") {
    logAuthSecurityEvent(
      "auth.legacy.usage",
      { endpoint: path, method: req.method },
      req
    );
  }

  next();
};
