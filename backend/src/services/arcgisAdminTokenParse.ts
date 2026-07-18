import type { AdminTokenJson } from "./arcgisAdminTokenRequest";
import { resolveAdminTokenExpiry } from "./arcgisAdminTokenExpiry";

export function parseAdminTokenJson(
  json: AdminTokenJson,
  skewBufferMs: number
): { access_token: string; expires_at: number } {
  if (json.error) {
    const details = (json.error.details || []).join(" | ");
    throw new Error(
      `ArcGIS admin token error: ${json.error.message || "Unknown error"}${
        details ? ` | ${details}` : ""
      }`
    );
  }
  if (!json.token) {
    throw new Error(
      `ArcGIS admin token missing token field: ${JSON.stringify(json).slice(0, 200)}`
    );
  }
  return {
    access_token: json.token,
    expires_at: resolveAdminTokenExpiry(json.expires, skewBufferMs),
  };
}
