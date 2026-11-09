import { randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, RequestHandler, Response } from "express";
import { migrationConfig } from "./config";

type MigrationSession = { migrationCsrf?: string };
const session = (req: Request): MigrationSession => req.session as unknown as MigrationSession;
export function migrationCsrf(req: Request): string { if (!session(req).migrationCsrf) session(req).migrationCsrf = randomBytes(32).toString("base64url"); return session(req).migrationCsrf!; }
function same(a: string, b: string): boolean { const left = Buffer.from(a), right = Buffer.from(b); return left.length === right.length && timingSafeEqual(left, right); }
export const requireMigrationCsrf: RequestHandler = (req, res, next) => {
  const origin = req.get("origin");
  const own = `${req.protocol}://${req.get("host")}`;
  if (!origin || (origin !== own && !migrationConfig(req.hostname).browserOrigins.includes(origin)) || !same(req.get("x-lis-migration-csrf") || "", session(req).migrationCsrf || "")) { res.status(403).json({ code: "MIGRATION_CSRF_INVALID", message: "A same-origin migration CSRF token is required" }); return; }
  next();
};
export function migrationApiError(res: Response, error: unknown): void {
  const code = error instanceof Error ? error.message : "MIGRATION_FAILED";
  const status = /NOT_FOUND/.test(code) ? 404 : /FORBIDDEN|CSRF|ADMIN/.test(code) ? 403 : /EXPIRED/.test(code) ? 410 : /CONFLICT|CHANGED|UNAVAILABLE/.test(code) ? 409 : /INVALID|TOO_LARGE|SCHEMA|PHOTO/.test(code) ? 422 : 500;
  res.status(status).json({ code, message: code.split("_").join(" ") });
}
