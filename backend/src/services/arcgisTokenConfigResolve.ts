import type { ArcgisTokenConfig } from "./arcgis";
import { firstNonEmpty } from "../helpers/firstNonEmpty";

type StringFieldSpec = {
  candidates: Array<string | undefined>;
  fallback?: string;
};

export function buildArcgisTokenStringFieldSpecs(
  config: ArcgisTokenConfig | undefined,
  env: NodeJS.ProcessEnv
): Record<string, StringFieldSpec> {
  const refererFromOrigins = env.REACT_APP_ARCGIS_REFERER_ORIGINS?.split(",")[0];

  return {
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
}

export function resolveArcgisTokenStringFields(
  specs: Record<string, StringFieldSpec>
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, spec] of Object.entries(specs)) {
    resolved[key] = firstNonEmpty(spec.candidates, spec.fallback);
  }
  return resolved;
}

export function resolveArcgisTokenNumericFields(config?: ArcgisTokenConfig) {
  return {
    requestTimeoutMs: config?.requestTimeoutMs ?? 15000,
    retryCount: config?.retryCount ?? 2,
    retryBaseDelayMs: config?.retryBaseDelayMs ?? 400,
    skewBufferMs: config?.skewBufferMs ?? 60000,
    minTtlMs: config?.minTtlMs ?? 0,
  };
}
