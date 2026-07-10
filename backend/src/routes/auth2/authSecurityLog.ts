import type { Request } from "express";
import { createHash } from "crypto";

const SENSITIVE_KEYS = new Set([
  "password",
  "otp",
  "refresh_token",
  "access_token",
  "token",
  "client_secret",
]);

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || req.ip || "unknown";
  }
  return req.ip || "unknown";
}

export function hashUsername(username: string): string {
  return createHash("sha256")
    .update(username.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
}

export function logAuthSecurityEvent(
  event: string,
  meta: Record<string, unknown> = {},
  req?: Request
): void {
  const safeMeta: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      continue;
    }
    safeMeta[key] = value;
  }

  if (req) {
    safeMeta.ip = getClientIp(req);
  }

  console.warn(
    JSON.stringify({
      type: "auth2.security",
      event,
      ...safeMeta,
      ts: new Date().toISOString(),
    })
  );
}
