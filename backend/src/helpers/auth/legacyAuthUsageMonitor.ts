import type { RequestHandler } from "express";
import { logAuthSecurityEvent } from "../../routes/auth2/authSecurityLog";

const LEGACY_AUTH_PATHS = new Set([
  "/auth/login-direct",
  "/auth/desktop-ok",
]);

function logLegacyUsage(
  req: Parameters<RequestHandler>[0],
  extra: Record<string, string> = {}
) {
  logAuthSecurityEvent({
    event: "auth.legacy.usage",
    meta: { endpoint: req.path, method: req.method, ...extra },
    req,
  });
}

function isDesktopLoginGet(req: Parameters<RequestHandler>[0]): boolean {
  if (req.path !== "/auth/login" || req.method !== "GET") return false;
  return String(req.query.mode || "").toLowerCase() === "desktop";
}

function isLegacyPathGet(req: Parameters<RequestHandler>[0]): boolean {
  return (
    LEGACY_AUTH_PATHS.has(req.path) &&
    req.method === "GET" &&
    req.path !== "/auth/login"
  );
}

/**
 * Logs usage of legacy auth endpoints for deprecation planning (L5).
 * Does not block requests — monitoring only.
 */
export const legacyAuthUsageMonitor: RequestHandler = (req, _res, next) => {
  if (req.path === "/auth/login-direct" && req.method === "POST") {
    logLegacyUsage(req);
  } else if (isDesktopLoginGet(req)) {
    logLegacyUsage(req, { mode: "desktop" });
  } else if (isLegacyPathGet(req)) {
    logLegacyUsage(req);
  }

  next();
};
