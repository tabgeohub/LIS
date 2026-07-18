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

export function resolveArcgisTokenNumericFields(config?: ArcgisTokenConfig) {
  return {
    requestTimeoutMs: config?.requestTimeoutMs ?? 15000,
    retryCount: config?.retryCount ?? 2,
    retryBaseDelayMs: config?.retryBaseDelayMs ?? 400,
    skewBufferMs: config?.skewBufferMs ?? 60000,
    minTtlMs: config?.minTtlMs ?? 0,
  };
}
