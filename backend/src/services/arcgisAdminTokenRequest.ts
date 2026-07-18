import type { ResolvedArcgisTokenConfig } from "./arcgisTokenConfig";

export type AdminTokenJson = {
  token?: string;
  expires?: number;
  error?: { message?: string; details?: string[] };
};

export function buildAdminTokenEndpoint(portalUrl: string): string {
  const portal = portalUrl
    .replace(/\/+$/, "")
    .replace(/\/sharing\/rest$/i, "");
  return `${portal}/sharing/rest/generateToken`;
}

export function buildAdminTokenRequestBody(cfg: ResolvedArcgisTokenConfig) {
  return new URLSearchParams({
    f: "json",
    username: cfg.adminUser,
    password: cfg.adminPass,
    client: "referer",
    referer: cfg.referer,
    expiration: "60",
  });
}

export function buildAdminTokenFetchInit(
  body: URLSearchParams,
  signal: AbortSignal
) {
  return {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Accept: "application/json",
    },
    body: body.toString(),
    signal,
  };
}
