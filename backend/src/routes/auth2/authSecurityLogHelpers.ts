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

export function getClientIp(req: Request): string {
  return readForwardedClientIp(req) ?? req.ip ?? "unknown";
}

function readForwardedClientIp(req: Request): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded !== "string" || forwarded.length === 0) return undefined;
  return forwarded.split(",")[0]?.trim() || undefined;
}

export function hashUsername(username: string): string {
  return createHash("sha256")
    .update(username.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
}

export function sanitizeAuthSecurityMeta(
  meta: Record<string, unknown>
): Record<string, unknown> {
  const safeMeta: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) continue;
    safeMeta[key] = value;
  }
  return safeMeta;
}
