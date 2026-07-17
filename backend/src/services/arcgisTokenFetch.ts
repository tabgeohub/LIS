import { fetch, Response } from "undici";
import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";
import {
  HttpError,
  isHttpErrorWithStatus,
  readJsonResponse,
} from "./arcgisTokenFetchShared";
import { fetchArcgisAdminTokenOnce } from "./arcgisAdminTokenFetch";

export { HttpError, isHttpErrorWithStatus, fetchArcgisAdminTokenOnce };

type TokenJson = {
  access_token: string;
  expires_in: number;
};

export async function fetchArcgisOAuthTokenOnce(
  cfg: ResolvedArcgisTokenConfig
): Promise<{ access_token: string; expires_at: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), cfg.requestTimeoutMs);

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });

  let res: Response;
  try {
    res = await fetch(cfg.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
  } catch (e: unknown) {
    clearTimeout(timeoutId);
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`Network error reaching ArcGIS token endpoint: ${message}`);
  }
  clearTimeout(timeoutId);

  const json = await readJsonResponse<TokenJson>(res, "ArcGIS token");
  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new Error(
      `ArcGIS token JSON missing fields: ${JSON.stringify(json).slice(0, 200)}`
    );
  }

  const now = Date.now();
  const expires_at =
    now + json.expires_in * 1000 - Math.max(0, cfg.skewBufferMs);
  return { access_token: json.access_token, expires_at };
}
