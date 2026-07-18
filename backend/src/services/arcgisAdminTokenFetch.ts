import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";
import { readJsonResponse } from "./arcgisTokenFetchShared";
import type { AdminTokenJson } from "./arcgisAdminTokenRequest";
import { parseAdminTokenJson } from "./arcgisAdminTokenParse";
import { postArcgisAdminToken } from "./arcgisAdminTokenPost";

export { resolveAdminTokenExpiry } from "./arcgisAdminTokenExpiry";

export async function fetchArcgisAdminTokenOnce(
  cfg: ResolvedArcgisTokenConfig
): Promise<{ access_token: string; expires_at: number }> {
  const res = await postArcgisAdminToken(cfg);
  const json = await readJsonResponse<AdminTokenJson>(
    res,
    "ArcGIS admin token"
  );
  return parseAdminTokenJson(json, cfg.skewBufferMs);
}
