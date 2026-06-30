import { ProxyAgent, setGlobalDispatcher } from "undici";
import type { ArcgisTokenConfig } from "./arcgis";

export type ResolvedArcgisTokenConfig = Required<ArcgisTokenConfig>;

function readEnvString(...values: Array<string | undefined>): string {
  for (const value of values) {
    if (value) {
      return value;
    }
  }
  return "";
}

export function resolveArcgisTokenConfig(
  config?: ArcgisTokenConfig
): ResolvedArcgisTokenConfig {
  const env = process.env;

  return {
    tokenEndpoint:
      config?.tokenEndpoint ||
      env.ARCGIS_TOKEN_ENDPOINT ||
      "https://www.arcgis.com/sharing/rest/oauth2/token",
    clientId: config?.clientId || env.ARCGIS_CLIENT_ID || "",
    clientSecret: config?.clientSecret || env.ARCGIS_CLIENT_SECRET || "",
    portalUrl: readEnvString(
      config?.portalUrl,
      env.ARCGIS_PORTAL_URL,
      env.ARCGIS_SERVER_URL,
      env.REACT_APP_ARCGIS_PORTAL_URL
    ),
    adminUser: readEnvString(
      config?.adminUser,
      env.ARCGIS_ADMIN_USER,
      env.REACT_APP_ARCGIS_ADMIN_USER
    ),
    adminPass: readEnvString(
      config?.adminPass,
      env.ARCGIS_ADMIN_PASS,
      env.REACT_APP_ARCGIS_ADMIN_PASS
    ),
    referer:
      config?.referer ||
      env.ARCGIS_TOKEN_REFERER ||
      env.REACT_APP_ARCGIS_REFERER_ORIGINS?.split(",")[0] ||
      env.PUBLIC_FRONTEND_URL ||
      "http://localhost:3000",
    requestTimeoutMs: config?.requestTimeoutMs ?? 15000,
    retryCount: config?.retryCount ?? 2,
    retryBaseDelayMs: config?.retryBaseDelayMs ?? 400,
    skewBufferMs: config?.skewBufferMs ?? 60000,
    minTtlMs: config?.minTtlMs ?? 0,
  };
}

export function assertArcgisTokenCredentials(
  resolved: ResolvedArcgisTokenConfig
): void {
  const hasAdminCreds =
    !!resolved.portalUrl && !!resolved.adminUser && !!resolved.adminPass;

  if (hasAdminCreds) {
    return;
  }

  if (!resolved.clientId) {
    throw new Error("Missing ArcGIS clientId (set ARCGIS_CLIENT_ID)");
  }
  if (!resolved.clientSecret) {
    throw new Error("Missing ArcGIS clientSecret (set ARCGIS_CLIENT_SECRET)");
  }
}

let proxyInitialized = false;

export function ensureArcgisHttpProxy(): void {
  if (proxyInitialized) {
    return;
  }

  const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxy) {
    setGlobalDispatcher(new ProxyAgent(proxy));
  }

  proxyInitialized = true;
}
