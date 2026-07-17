import type { ArcgisTokenConfig } from "./arcgis";
import { ensureUndiciCorporateProxy } from "../helpers/http/outboundHttpProxy";
import {
  buildArcgisTokenStringFieldSpecs,
  resolveArcgisTokenNumericFields,
  resolveArcgisTokenStringFields,
} from "./arcgisTokenConfigResolve";

export type ResolvedArcgisTokenConfig = Required<ArcgisTokenConfig>;

export function resolveArcgisTokenConfig(
  config?: ArcgisTokenConfig
): ResolvedArcgisTokenConfig {
  const strings = resolveArcgisTokenStringFields(
    buildArcgisTokenStringFieldSpecs(config, process.env)
  );

  return {
    ...(strings as Pick<
      ResolvedArcgisTokenConfig,
      | "tokenEndpoint"
      | "clientId"
      | "clientSecret"
      | "portalUrl"
      | "adminUser"
      | "adminPass"
      | "referer"
    >),
    ...resolveArcgisTokenNumericFields(config),
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

export function ensureArcgisHttpProxy(): void {
  // Same corporate proxy env resolution as OIDC / Keycloak Admin (undici).
  ensureUndiciCorporateProxy();
}
