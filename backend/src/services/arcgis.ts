/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProxyAgent, setGlobalDispatcher, fetch, Response } from "undici";

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

let cfg: Required<ArcgisTokenConfig> | null = null;
let cache: Cached = null;
let proxyInitialized = false;

export function initArcgisToken(config?: ArcgisTokenConfig): void {
  const env = process.env;

  const tokenEndpoint =
    config?.tokenEndpoint ||
    env.ARCGIS_TOKEN_ENDPOINT ||
    "https://www.arcgis.com/sharing/rest/oauth2/token";

  const clientId = config?.clientId || env.ARCGIS_CLIENT_ID;
  const clientSecret = config?.clientSecret || env.ARCGIS_CLIENT_SECRET;
  const portalUrl =
    config?.portalUrl ||
    env.ARCGIS_PORTAL_URL ||
    env.ARCGIS_SERVER_URL ||
    env.REACT_APP_ARCGIS_PORTAL_URL ||
    "";
  const adminUser =
    config?.adminUser ||
    env.ARCGIS_ADMIN_USER ||
    env.REACT_APP_ARCGIS_ADMIN_USER ||
    "";
  const adminPass =
    config?.adminPass ||
    env.ARCGIS_ADMIN_PASS ||
    env.REACT_APP_ARCGIS_ADMIN_PASS ||
    "";
  const referer =
    config?.referer ||
    env.ARCGIS_TOKEN_REFERER ||
    env.REACT_APP_ARCGIS_REFERER_ORIGINS?.split(",")[0] ||
    env.PUBLIC_FRONTEND_URL ||
    "http://localhost:3000";

  const hasAdminCreds = !!portalUrl && !!adminUser && !!adminPass;
  if (!hasAdminCreds) {
    if (!clientId)
      throw new Error("Missing ArcGIS clientId (set ARCGIS_CLIENT_ID)");
    if (!clientSecret) {
      throw new Error("Missing ArcGIS clientSecret (set ARCGIS_CLIENT_SECRET)");
    }
  }

  if (!proxyInitialized) {
    const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    if (proxy) {
      setGlobalDispatcher(new ProxyAgent(proxy));
    }
    proxyInitialized = true;
  }

  cfg = {
    tokenEndpoint,
    clientId: clientId || "",
    clientSecret: clientSecret || "",
    portalUrl: portalUrl as any,
    adminUser: adminUser as any,
    adminPass: adminPass as any,
    referer: referer as any,
    requestTimeoutMs: config?.requestTimeoutMs ?? 15000,
    retryCount: config?.retryCount ?? 2,
    retryBaseDelayMs: config?.retryBaseDelayMs ?? 400,
    skewBufferMs: config?.skewBufferMs ?? 60000,
    minTtlMs: config?.minTtlMs ?? 0,
  } as Required<ArcgisTokenConfig>;
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
      if (isHttpErrorWithStatus(err, 400, 499)) break;
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

function isHttpErrorWithStatus(err: any, lo: number, hi: number) {
  return err instanceof HttpError && err.status >= lo && err.status <= hi;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeError(err: any, fallback: string) {
  return err instanceof Error ? err : new Error(`${fallback}: ${String(err)}`);
}
