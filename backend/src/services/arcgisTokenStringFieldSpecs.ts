import type { ArcgisTokenConfig } from "./arcgis";

export type StringFieldSpec = {
  candidates: Array<string | undefined>;
  fallback?: string;
};

export function buildTokenEndpointAndClientSpecs(
  config: ArcgisTokenConfig | undefined,
  env: NodeJS.ProcessEnv
): Record<string, StringFieldSpec> {
  return {
    tokenEndpoint: {
      candidates: [config?.tokenEndpoint, env.ARCGIS_TOKEN_ENDPOINT],
      fallback: "https://www.arcgis.com/sharing/rest/oauth2/token",
    },
    clientId: { candidates: [config?.clientId, env.ARCGIS_CLIENT_ID] },
    clientSecret: {
      candidates: [config?.clientSecret, env.ARCGIS_CLIENT_SECRET],
    },
  };
}

export function buildPortalUrlSpec(
  config: ArcgisTokenConfig | undefined,
  env: NodeJS.ProcessEnv
): StringFieldSpec {
  return {
    candidates: [
      config?.portalUrl,
      env.ARCGIS_PORTAL_URL,
      env.ARCGIS_SERVER_URL,
      env.REACT_APP_ARCGIS_PORTAL_URL,
    ],
  };
}

export function buildAdminUserAndPassSpecs(
  config: ArcgisTokenConfig | undefined,
  env: NodeJS.ProcessEnv
): Record<string, StringFieldSpec> {
  return {
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
  };
}

export function buildRefererSpec(
  config: ArcgisTokenConfig | undefined,
  env: NodeJS.ProcessEnv
): StringFieldSpec {
  const refererFromOrigins = env.REACT_APP_ARCGIS_REFERER_ORIGINS?.split(",")[0];
  return {
    candidates: [
      config?.referer,
      env.ARCGIS_TOKEN_REFERER,
      refererFromOrigins,
      env.PUBLIC_FRONTEND_URL,
    ],
    fallback: "http://localhost:3000",
  };
}
