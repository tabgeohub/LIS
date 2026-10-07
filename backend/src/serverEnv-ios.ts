import { config as loadEnv } from "dotenv";

export const ACCEPTANCE_BASE_URL_IOS = "http://acc-lis.rws.nl/backend/";
export interface IosServerConfig {
  host: string;
  port: number;
  publicBaseUrl: string;
  shutdownTimeoutMs: number;
}

export function readServerConfigIos(): IosServerConfig {
  // Never implicitly load the baseline .env or require its service credentials.
  if (process.env.IOS_ENV_FILE) {
    const result = loadEnv({ path: process.env.IOS_ENV_FILE, override: false });
    if (result.error) throw new Error("ios_env_file_unreadable");
  }
  const host = process.env.IOS_HOST || "127.0.0.1";
  if (!["127.0.0.1", "::1", "0.0.0.0"].includes(host)) {
    throw new Error("invalid_ios_host");
  }
  const portText = process.env.IOS_PORT || "5001";
  const port = Number(portText);
  if (!/^\d+$/.test(portText) || !Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error("invalid_ios_port");
  }
  const publicBaseUrl = process.env.IOS_PUBLIC_BASE_URL || ACCEPTANCE_BASE_URL_IOS;
  let url: URL;
  try { url = new URL(publicBaseUrl); } catch { throw new Error("invalid_ios_base_url"); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || url.pathname !== "/backend/") {
    throw new Error("invalid_ios_base_url");
  }
  return { host, port, publicBaseUrl: url.href, shutdownTimeoutMs: 10_000 };
}

/** Only relative, same-origin routes; retain the acceptance /backend/ prefix. */
export function composeBackendUrlIos(base: string, route: string): string {
  if (!/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(route)) {
    throw new Error("invalid_ios_relative_route");
  }
  const url = new URL(base);
  if (url.pathname !== "/backend/" || url.username || url.password || url.search || url.hash ||
      !["http:", "https:"].includes(url.protocol)) throw new Error("invalid_ios_base_url");
  return new URL(route, url).href;
}
