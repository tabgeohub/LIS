import type { ArcgisTokenConfig } from "./arcgis";
import { firstNonEmpty } from "../helpers/firstNonEmpty";
import {
  buildAdminUserAndPassSpecs,
  buildPortalUrlSpec,
  buildRefererSpec,
  buildTokenEndpointAndClientSpecs,
  type StringFieldSpec,
} from "./arcgisTokenStringFieldSpecs";

export function buildArcgisTokenStringFieldSpecs(
  config: ArcgisTokenConfig | undefined,
  env: NodeJS.ProcessEnv
): Record<string, StringFieldSpec> {
  return {
    ...buildTokenEndpointAndClientSpecs(config, env),
    portalUrl: buildPortalUrlSpec(config, env),
    ...buildAdminUserAndPassSpecs(config, env),
    referer: buildRefererSpec(config, env),
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

const ARCGIS_TOKEN_NUMERIC_DEFAULTS = {
  requestTimeoutMs: 15000,
  retryCount: 2,
  retryBaseDelayMs: 400,
  skewBufferMs: 60000,
  minTtlMs: 0,
} as const;

function pickNumericField(options: {
  config: ArcgisTokenConfig | undefined;
  key: keyof typeof ARCGIS_TOKEN_NUMERIC_DEFAULTS;
}): number {
  return options.config?.[options.key] ?? ARCGIS_TOKEN_NUMERIC_DEFAULTS[options.key];
}

export function resolveArcgisTokenNumericFields(config?: ArcgisTokenConfig) {
  return {
    requestTimeoutMs: pickNumericField({ config, key: "requestTimeoutMs" }),
    retryCount: pickNumericField({ config, key: "retryCount" }),
    retryBaseDelayMs: pickNumericField({ config, key: "retryBaseDelayMs" }),
    skewBufferMs: pickNumericField({ config, key: "skewBufferMs" }),
    minTtlMs: pickNumericField({ config, key: "minTtlMs" }),
  };
}
