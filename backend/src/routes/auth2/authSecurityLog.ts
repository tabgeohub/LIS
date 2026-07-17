import type { Request } from "express";
import {
  getClientIp,
  hashUsername,
  sanitizeAuthSecurityMeta,
} from "./authSecurityLogHelpers";

export { hashUsername } from "./authSecurityLogHelpers";

export function logAuthSecurityEvent(
  event: string,
  meta: Record<string, unknown> = {},
  req?: Request
): void {
  const safeMeta = sanitizeAuthSecurityMeta(meta);
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
