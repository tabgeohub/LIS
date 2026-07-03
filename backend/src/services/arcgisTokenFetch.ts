import { fetch, Response } from "undici";
import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";

type TokenJson = {
  access_token: string;
  expires_in: number;
};

type AdminTokenJson = {
  token?: string;
  expires?: number;
  error?: { message?: string; details?: string[] };
};

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type HttpErrorStatusInput = {
  err: unknown;
  min: number;
  max: number;
};

export function isHttpErrorWithStatus(input: HttpErrorStatusInput) {
  const { err, min, max } = input;
  return err instanceof HttpError && err.status >= min && err.status <= max;
}

async function readJsonResponse<T>(res: Response, label: string): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(res.status, `${label} HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${label} response not JSON: ${text.slice(0, 200)}`);
  }
}

export async function fetchArcgisOAuthTokenOnce(
  cfg: ResolvedArcgisTokenConfig
): Promise<{ access_token: string; expires_at: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });

  let res: Response;
  try {
    res = await fetch(cfg.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
  } catch (e: unknown) {
    clearTimeout(timeoutId);
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Network error reaching ArcGIS token endpoint: ${message}`);
  }
  clearTimeout(timeoutId);

  const json = await readJsonResponse<TokenJson>(res, "ArcGIS token");
  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new Error(
      `ArcGIS token JSON missing fields: ${JSON.stringify(json).slice(0, 200)}`
    );
  }

  const now = Date.now();
  const expires_at = now + json.expires_in * 1000 - Math.max(0, cfg.skewBufferMs);
  return { access_token: json.access_token, expires_at };
}

export async function fetchArcgisAdminTokenOnce(
  cfg: ResolvedArcgisTokenConfig
): Promise<{ access_token: string; expires_at: number }> {
  const portal = cfg.portalUrl.replace(/\/+$/, "").replace(/\/sharing\/rest$/i, "");
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
    throw new Error(`Network error reaching ArcGIS admin token endpoint: ${message}`);
  }
  clearTimeout(timeoutId);

  const json = await readJsonResponse<AdminTokenJson>(res, "ArcGIS admin token");
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

  const now = Date.now();
  const expiresRaw = Number(json.expires || now + 60 * 60 * 1000);
  const expires_at =
    expiresRaw - Math.max(0, cfg.skewBufferMs) > now
      ? expiresRaw - Math.max(0, cfg.skewBufferMs)
      : now + 55 * 60 * 1000;

  return { access_token: json.token, expires_at };
}
