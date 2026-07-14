import esriId from "@arcgis/core/identity/IdentityManager";
import esriConfig from "@arcgis/core/config";
import * as urlUtils from "@arcgis/core/core/urlUtils";

export const ARCGIS_TOKEN_SERVERS = [
  "https://www.arcgis.com/sharing/rest",
  "https://services.arcgis.com",
  "https://services-eu1.arcgis.com",
  "https://tiles.arcgis.com",
  "https://utility.arcgis.com",
  "https://basemaps.arcgis.com",
  "https://rijkswaterstaat.maps.arcgis.com",
  "https://rijkswaterstaat.maps.arcgis.com/sharing/rest",
];

export function configureArcgisProxy(proxyUrl: string) {
  esriConfig.request.proxyUrl = proxyUrl;
  esriConfig.request.useIdentity = true;
  ARCGIS_TOKEN_SERVERS.map((server) => server.replace("/sharing/rest", ""))
    .filter((server, index, all) => all.indexOf(server) === index)
    .forEach((urlPrefix) => urlUtils.addProxyRule({ urlPrefix, proxyUrl }));
}

export function registerArcgisToken(token: string) {
  ARCGIS_TOKEN_SERVERS.forEach((server) => esriId.registerToken({ server, token }));
  localStorage.setItem("credential_token", token);
  localStorage.setItem("credential_server", ARCGIS_TOKEN_SERVERS[0]);
}

export async function fetchArcgisToken(tokenEndpoint: string) {
  const response = await fetch(tokenEndpoint, { method: "GET", credentials: "include" });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Failed to fetch ArcGIS token (${response.status})`);
  }
  const data = await response.json();
  const token = String(data?.access_token || "");
  if (!token) throw new Error("Invalid ArcGIS token response from backend");
  return token;
}
