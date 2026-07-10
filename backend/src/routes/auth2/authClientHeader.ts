import type { Request } from "express";

export const LIS_CLIENT_HEADER = "x-lis-client";
export const LIS_DESKTOP_CLIENT = "desktop";

export function getLisClient(req: Request): string | undefined {
  const value = req.headers[LIS_CLIENT_HEADER];
  if (typeof value === "string" && value.trim()) {
    return value.trim().toLowerCase();
  }
  return undefined;
}

export function isDesktopClient(req: Request): boolean {
  return getLisClient(req) === LIS_DESKTOP_CLIENT;
}

export function isClientHeaderRequired(): boolean {
  return process.env.AUTH2_REQUIRE_CLIENT_HEADER?.trim().toLowerCase() === "true";
}

export function isAllowedAuthClient(req: Request): boolean {
  if (!isClientHeaderRequired()) {
    return true;
  }
  return isDesktopClient(req);
}
