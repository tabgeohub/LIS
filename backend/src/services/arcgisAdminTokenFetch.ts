import { fetch, Response } from "undici";
import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";
import { readJsonResponse } from "./arcgisTokenFetchShared";

type AdminTokenJson = {
  token?: string;
  expires?: number;
  error?: { message?: string; details?: string[] };
};

export function resolveAdminTokenExpiry(
  expires: number | undefined,
  skewBufferMs: number
): number {
  const now = Date.now();
  const expiresRaw = Number(expires || now + 60 * 60 * 1000);
  return expiresRaw - Math.max(0, skewBufferMs) > now
    ? expiresRaw - Math.max(0, skewBufferMs)
    : now + 55 * 60 * 1000;
}

export async function fetchArcgisAdminTokenOnce(
  cfg: ResolvedArcgisTokenConfig
): Promise<{ access_token: string; expires_at: number }> {
  const portal = cfg.portalUrl
    .replace(/\/+$/, "")
    .replace(/\/sharing\/rest$/i, "");
  const endpoint = `${portal}/sharing/rest/generateToken`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);

  const body = new URLSearchParams({
    f: "json",
    username: cfg.adminUser,
    password: cfg.adminPass,
    client: "referer",
    referer: cfg.referer,
    expiration: "60",
  });

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      body: body.toString(),
      signal: controller.signal,
    });
  } catch (e: unknown) {
    clearTimeout(timeoutId);
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Network error reaching ArcGIS admin token endpoint: ${message}`
    );
  }
  clearTimeout(timeoutId);

  const json = await readJsonResponse<AdminTokenJson>(
    res,
    "ArcGIS admin token"
  );
  if (json.error) {
    const details = (json.error.details || []).join(" | ");
    throw new Error(
      `ArcGIS admin token error: ${json.error.message || "Unknown error"}${
        details ? ` | ${details}` : ""
      }`
    );
  }
  if (!json.token) {
    throw new Error(
      `ArcGIS admin token missing token field: ${JSON.stringify(json).slice(0, 200)}`
    );
  }

  return {
    access_token: json.token,
    expires_at: resolveAdminTokenExpiry(json.expires, cfg.skewBufferMs),
  };
}
