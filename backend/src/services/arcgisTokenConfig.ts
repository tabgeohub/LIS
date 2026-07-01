import { ProxyAgent, setGlobalDispatcher } from "undici";
import type { ArcgisTokenConfig } from "./arcgis";

export type ResolvedArcgisTokenConfig = Required<ArcgisTokenConfig>;

function firstNonEmpty(
  candidates: Array<string | undefined>,
  fallback = ""
): string {
  for (const value of candidates) {
    if (value) {
      return value;
    }
  }
  return fallback;
}

export function resolveArcgisTokenConfig(
  config?: ArcgisTokenConfig
): ResolvedArcgisTokenConfig {
  const env = process.env;
  const refererFromOrigins = env.REACT_APP_ARCGIS_REFERER_ORIGINS?.split(",")[0];

  const strings: Record<string, { candidates: Array<string | undefined>; fallback?: string }> = {
    tokenEndpoint: {
      candidates: [config?.tokenEndpoint, env.ARCGIS_TOKEN_ENDPOINT],
      fallback: "https://www.arcgis.com/sharing/rest/oauth2/token",
    },
    clientId: { candidates: [config?.clientId, env.ARCGIS_CLIENT_ID] },
    clientSecret: {
      candidates: [config?.clientSecret, env.ARCGIS_CLIENT_SECRET],
    },
    portalUrl: {
      candidates: [
        config?.portalUrl,
        env.ARCGIS_PORTAL_URL,
        env.ARCGIS_SERVER_URL,
        env.REACT_APP_ARCGIS_PORTAL_URL,
      ],
    },
    adminUser: {
      candidates: [
        config?.adminUser,
        env.ARCGIS_ADMIN_USER,
        env.REACT_APP_ARCGIS_ADMIN_USER,
      ],
    },
    adminPass: {
      candidates: [
        config?.adminPass,
        env.ARCGIS_ADMIN_PASS,
        env.REACT_APP_ARCGIS_ADMIN_PASS,
      ],
    },
    referer: {
      candidates: [
        config?.referer,
        env.ARCGIS_TOKEN_REFERER,
        refererFromOrigins,
        env.PUBLIC_FRONTEND_URL,
      ],
      fallback: "http://localhost:3000",
    },
  };

  const resolvedStrings = {} as Record<keyof typeof strings, string>;
  for (const [key, spec] of Object.entries(strings)) {
    resolvedStrings[key] = firstNonEmpty(spec.candidates, spec.fallback);
  }

  return {
    ...(resolvedStrings as Record<
      "tokenEndpoint" | "clientId" | "clientSecret" | "portalUrl" | "adminUser" | "adminPass" | "referer",
      string
    >),
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
