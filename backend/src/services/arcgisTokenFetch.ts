import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";
import {
  HttpError,
  isHttpErrorWithStatus,
  readJsonResponse,
} from "./arcgisTokenFetchShared";
import { fetchArcgisAdminTokenOnce } from "./arcgisAdminTokenFetch";
import {
  parseOAuthTokenJson,
  postArcgisOAuthToken,
  type OAuthTokenJson,
} from "./arcgisOAuthTokenPost";

export { HttpError, isHttpErrorWithStatus, fetchArcgisAdminTokenOnce };

export async function fetchArcgisOAuthTokenOnce(
  cfg: ResolvedArcgisTokenConfig
): Promise<{ access_token: string; expires_at: number }> {
  const res = await postArcgisOAuthToken(cfg);
  const json = await readJsonResponse<OAuthTokenJson>(res, "ArcGIS token");
  return parseOAuthTokenJson(json, cfg.skewBufferMs);
}
