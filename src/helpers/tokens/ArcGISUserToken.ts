import esriId from "@arcgis/core/identity/IdentityManager";
import esriConfig from "@arcgis/core/config";
import * as urlUtils from "@arcgis/core/core/urlUtils";
import { getBackEndUrl } from "../getBackEndUrl";

type RefreshOptions = {
  useProxy?: boolean;
  refreshEveryMs?: number;
  extraServers?: string[];
};

function registerTokenForServers(token: string, servers: string[]): void {
  const normalized = Array.from(
    new Set(servers.map((s) => s.replace(/\/+$/, "")))
  );

  normalized.forEach((server) => {
    esriId.registerToken({ server, token });
  });
}

export async function refreshArcGISUserToken(
  options: RefreshOptions = {}
): Promise<() => void> {
  const {
    useProxy = true,
    refreshEveryMs = 5 * 60 * 1000,
    extraServers = [],
  } = options;
  const backendUrl = getBackEndUrl();
  const tokenEndpoint = `${backendUrl}/api/arcgis/token`;

  const defaultServers = [
    "https://www.arcgis.com/sharing/rest",
    "https://services.arcgis.com",
    "https://services-eu1.arcgis.com",
    "https://tiles.arcgis.com",
    "https://utility.arcgis.com",
    "https://basemaps.arcgis.com",
    "https://rijkswaterstaat.maps.arcgis.com",
    "https://rijkswaterstaat.maps.arcgis.com/sharing/rest",
  ];

  const servers = Array.from(
    new Set([...defaultServers, ...extraServers].filter(Boolean))
  );

  if (useProxy) {
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
  } else {
    esriConfig.request.useIdentity = true;
  }

  async function fetchAndRegister(): Promise<void> {
    const res = await fetch(tokenEndpoint, {
      credentials: "omit",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch token: ${res.status} ${text}`);
    }

    const { access_token } = (await res.json()) as {
      access_token: string;
      expires_at?: number;
    };

    if (!access_token) {
      throw new Error("No access_token in token response");
    }

    registerTokenForServers(access_token, servers);
    localStorage.setItem("credential_token", access_token);
    localStorage.setItem("credential_server", servers[0]);
  }

  await fetchAndRegister();
  const intervalId = window.setInterval(fetchAndRegister, refreshEveryMs);

  return () => clearInterval(intervalId);
}

