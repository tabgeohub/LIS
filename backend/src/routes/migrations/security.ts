import { randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";

type MigrationSession = { migrationCsrf?: string };
function session(req: Request): MigrationSession { return req.session as unknown as MigrationSession; }
export function migrationCsrf(req: Request): string {
  const state = session(req);
  if (!state.migrationCsrf) state.migrationCsrf = randomBytes(32).toString("base64url");
  return state.migrationCsrf;
}
function same(a: string, b: string): boolean { const left = Buffer.from(a), right = Buffer.from(b); return left.length === right.length && timingSafeEqual(left, right); }
function acceptedOrigin(req: Request): boolean {
  const origin = req.get("origin");
  if (!origin) return false;
  const own = `${req.protocol}://${req.get("host")}`;
  return origin === own || [process.env.PUBLIC_FRONTEND_URL, process.env.INTRANET_FRONTEND_URL].includes(origin);
}
/** Browser state changes require a session-bound token and a known first-party origin. */
export const requireMigrationCsrf: RequestHandler = (req, res, next) => {
  const supplied = req.get("x-lis-migration-csrf") || "";
  const expected = session(req).migrationCsrf || "";
  if (!acceptedOrigin(req) || !expected || !same(supplied, expected)) {
    res.status(403).json({ code: "MIGRATION_CSRF_INVALID", message: "A same-origin migration CSRF token is required" }); return;
  }
  next();
};
export function hasServiceCredential(req: Request, expected: string): boolean {
  const match = /^Bearer (.+)$/.exec(req.get("authorization") || "");
  return Boolean(match && expected && same(match[1], expected));
}
export function migrationApiError(res: Response, error: unknown): void {
  const code = error instanceof Error ? error.message : "MIGRATION_FAILED";
  const status = /NOT_FOUND/.test(code) ? 404 : /FORBIDDEN|CSRF|ADMIN/.test(code) ? 403 : /EXPIRED/.test(code) ? 410 : /CONFLICT|CHANGED|UNAVAILABLE/.test(code) ? 409 : /INVALID|TOO_LARGE|SCHEMA/.test(code) ? 422 : 500;
  res.status(status).json({ code, message: code.split("_").join(" ") });
}
