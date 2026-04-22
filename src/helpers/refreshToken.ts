import esriId from "@arcgis/core/identity/IdentityManager";
import esriConfig from "@arcgis/core/config";
import * as urlUtils from "@arcgis/core/core/urlUtils";
import { getBackEndUrl } from "./getBackEndUrl";

export async function refreshToken() {
  const backendUrl = getBackEndUrl();
  const tokenEndpoint = `${backendUrl}/api/arcgis/token`;
  const servers = [
    "https://www.arcgis.com/sharing/rest",
    "https://services.arcgis.com",
    "https://services-eu1.arcgis.com",
    "https://tiles.arcgis.com",
    "https://utility.arcgis.com",
    "https://basemaps.arcgis.com",
    "https://rijkswaterstaat.maps.arcgis.com",
    "https://rijkswaterstaat.maps.arcgis.com/sharing/rest",
  ];

  const proxyUrl = `${backendUrl}/api/arcgis/proxy`;
  esriConfig.request.proxyUrl = proxyUrl;
  esriConfig.request.useIdentity = true;
  [
    "https://www.arcgis.com",
    "https://services.arcgis.com",
    "https://services-eu1.arcgis.com",
    "https://tiles.arcgis.com",
    "https://utility.arcgis.com",
    "https://basemaps.arcgis.com",
    "https://rijkswaterstaat.maps.arcgis.com",
  ].forEach((urlPrefix) => {
    urlUtils.addProxyRule({ urlPrefix, proxyUrl });
  });

  async function fetchAndRegisterToken() {
    const response = await fetch(tokenEndpoint, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(message || `Failed to fetch ArcGIS token (${response.status})`);
    }

    const data = await response.json();
    const token = String(data?.access_token || "");
    if (!token) {
      throw new Error("Invalid ArcGIS token response from backend");
    }

    servers.forEach((server) => {
      esriId.registerToken({ server, token });
    });

    localStorage.setItem("credential_token", token);
    localStorage.setItem("credential_server", servers[0]);
  }

  await fetchAndRegisterToken();
}
