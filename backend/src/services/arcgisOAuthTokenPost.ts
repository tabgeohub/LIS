import { fetch, Response } from "undici";
import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";

export async function postArcgisOAuthToken(
  cfg: ResolvedArcgisTokenConfig
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });

  try {
    return await fetch(cfg.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Network error reaching ArcGIS token endpoint: ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

export type OAuthTokenJson = {
  access_token: string;
  expires_in: number;
};

export function parseOAuthTokenJson(
  json: OAuthTokenJson,
  skewBufferMs: number
): { access_token: string; expires_at: number } {
  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new Error(
      `ArcGIS token JSON missing fields: ${JSON.stringify(json).slice(0, 200)}`
    );
  }
  return {
    access_token: json.access_token,
    expires_at:
      Date.now() + json.expires_in * 1000 - Math.max(0, skewBufferMs),
  };
}
