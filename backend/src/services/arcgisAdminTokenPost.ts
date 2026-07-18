import { fetch, Response } from "undici";
import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";
import {
  buildAdminTokenEndpoint,
  buildAdminTokenFetchInit,
  buildAdminTokenRequestBody,
} from "./arcgisAdminTokenRequest";

export async function postArcgisAdminToken(
  cfg: ResolvedArcgisTokenConfig
): Promise<Response> {
  const endpoint = buildAdminTokenEndpoint(cfg.portalUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);
  try {
    return await fetch(
      endpoint,
      buildAdminTokenFetchInit(
        buildAdminTokenRequestBody(cfg),
        controller.signal
      )
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Network error reaching ArcGIS admin token endpoint: ${message}`
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
