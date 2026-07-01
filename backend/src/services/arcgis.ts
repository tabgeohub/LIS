/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetch, Response } from "undici";
import {
  assertArcgisTokenCredentials,
  ensureArcgisHttpProxy,
  resolveArcgisTokenConfig,
  type ResolvedArcgisTokenConfig,
} from "./arcgisTokenConfig";

type TokenJson = {
  access_token: string;
  expires_in: number;
  token_type?: string;
};

type AdminTokenJson = {
  token?: string;
  expires?: number;
  error?: {
    message?: string;
    details?: string[];
  };
};

export type ArcgisTokenConfig = {
  tokenEndpoint?: string;
  clientId?: string;
  clientSecret?: string;
  portalUrl?: string;
  adminUser?: string;
  adminPass?: string;
  referer?: string;
  requestTimeoutMs?: number;
  retryCount?: number;
  retryBaseDelayMs?: number;
  skewBufferMs?: number;
  minTtlMs?: number;
};

type Cached = { access_token: string; expires_at: number } | null;

let cfg: ResolvedArcgisTokenConfig | null = null;
let cache: Cached = null;

export function initArcgisToken(config?: ArcgisTokenConfig): void {
  const resolved = resolveArcgisTokenConfig(config);
  assertArcgisTokenCredentials(resolved);
  ensureArcgisHttpProxy();
  cfg = resolved;
}

export async function getValidToken(): Promise<{
  access_token: string;
  expires_at: number;
}> {
  if (!cfg) initArcgisToken();
  const now = Date.now();
  if (cache && now < cache.expires_at) {
    if (cfg!.minTtlMs > 0 && cache.expires_at - now < cfg!.minTtlMs) {
      // force refresh when almost expired
    } else {
      return cache;
    }
  }
  cache = await fetchArcgisTokenWithRetry();
  return cache!;
}

async function fetchArcgisTokenWithRetry(): Promise<{
  access_token: string;
  expires_at: number;
}> {
  let lastErr: any;
  for (let attempt = 0; attempt <= cfg!.retryCount; attempt++) {
    try {
      return await fetchArcgisTokenOnce();
    } catch (err: any) {
      lastErr = err;
      if (isHttpErrorWithStatus({ err, min: 400, max: 499 })) break;
      if (attempt < cfg!.retryCount) {
        await sleep(cfg!.retryBaseDelayMs * 2 ** attempt);
      }
    }
  }
  throw normalizeError(lastErr, "Failed to obtain ArcGIS token after retries");
}

async function fetchArcgisTokenOnce(): Promise<{
  access_token: string;
  expires_at: number;
}> {
  if (cfg?.portalUrl && cfg?.adminUser && cfg?.adminPass) {
    return fetchArcgisAdminTokenOnce();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg!.requestTimeoutMs);

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: cfg!.clientId,
    client_secret: cfg!.clientSecret,
  });

  let res: Response;
  try {
    res = await fetch(cfg!.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
  } catch (e: any) {
    clearTimeout(timeoutId);
    throw new Error(
      `Network error reaching ArcGIS token endpoint: ${e?.message || e}`
    );
  }
  clearTimeout(timeoutId);

  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(
      res.status,
      `ArcGIS token HTTP ${res.status}: ${text.slice(0, 500)}`
    );
  }

  let json: TokenJson;
  try {
    json = JSON.parse(text) as TokenJson;
  } catch {
    throw new Error(`ArcGIS token response not JSON: ${text.slice(0, 200)}`);
  }

  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new Error(
      `ArcGIS token JSON missing fields: ${JSON.stringify(json).slice(0, 200)}`
    );
  }

  const now = Date.now();
  const expires_at = now + json.expires_in * 1000 - Math.max(0, cfg!.skewBufferMs);
  return { access_token: json.access_token, expires_at };
}

async function fetchArcgisAdminTokenOnce(): Promise<{
  access_token: string;
  expires_at: number;
}> {
  const portal = (cfg!.portalUrl as unknown as string)
    .replace(/\/+$/, "")
    .replace(/\/sharing\/rest$/i, "");
  const endpoint = `${portal}/sharing/rest/generateToken`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg!.requestTimeoutMs);

  const body = new URLSearchParams({
    f: "json",
    username: cfg!.adminUser as unknown as string,
    password: cfg!.adminPass as unknown as string,
    client: "referer",
    referer: cfg!.referer as unknown as string,
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
  } catch (e: any) {
    clearTimeout(timeoutId);
    throw new Error(
      `Network error reaching ArcGIS admin token endpoint: ${e?.message || e}`
    );
  }
  clearTimeout(timeoutId);

  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(
      res.status,
      `ArcGIS admin token HTTP ${res.status}: ${text.slice(0, 500)}`
    );
  }

  let json: AdminTokenJson;
  try {
    json = JSON.parse(text) as AdminTokenJson;
  } catch {
    throw new Error(`ArcGIS admin token response not JSON: ${text.slice(0, 200)}`);
  }

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
    expiresRaw - Math.max(0, cfg!.skewBufferMs) > now
      ? expiresRaw - Math.max(0, cfg!.skewBufferMs)
      : now + 55 * 60 * 1000;

  return { access_token: json.token, expires_at };
}

class HttpError extends Error {
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

function isHttpErrorWithStatus(input: HttpErrorStatusInput) {
  const { err, min, max } = input;
  return err instanceof HttpError && err.status >= min && err.status <= max;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeError(err: any, fallback: string) {
  return err instanceof Error ? err : new Error(`${fallback}: ${String(err)}`);
}
