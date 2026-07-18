import type { Request } from "express";
import {
  getClientIp,
  hashUsername,
  sanitizeAuthSecurityMeta,
} from "./authSecurityLogHelpers";

export { hashUsername } from "./authSecurityLogHelpers";

export type LogAuthSecurityEventInput = {
  event: string;
  meta?: Record<string, unknown>;
  req?: Request;
};

export function logAuthSecurityEvent(input: LogAuthSecurityEventInput): void {
  const safeMeta = sanitizeAuthSecurityMeta(input.meta ?? {});
  if (input.req) {
    safeMeta.ip = getClientIp(input.req);
  }

  console.warn(
    JSON.stringify({
      type: "auth2.security",
      event: input.event,
      ...safeMeta,
      ts: new Date().toISOString(),
    })
  );
}
