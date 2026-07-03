/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  assertArcgisTokenCredentials,
  ensureArcgisHttpProxy,
  resolveArcgisTokenConfig,
  type ResolvedArcgisTokenConfig,
} from "./arcgisTokenConfig";
import {
  fetchArcgisAdminTokenOnce,
  fetchArcgisOAuthTokenOnce,
  isHttpErrorWithStatus,
} from "./arcgisTokenFetch";

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
  let lastErr: unknown;
  for (let attempt = 0; attempt <= cfg!.retryCount; attempt++) {
    try {
      return await fetchArcgisTokenOnce();
    } catch (err: unknown) {
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
    return fetchArcgisAdminTokenOnce(cfg);
  }
  return fetchArcgisOAuthTokenOnce(cfg!);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeError(err: unknown, fallback: string) {
  return err instanceof Error ? err : new Error(`${fallback}: ${String(err)}`);
}
