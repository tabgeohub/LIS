import esriId from "@arcgis/core/identity/IdentityManager";
import esriConfig from "@arcgis/core/config";
import * as urlUtils from "@arcgis/core/core/urlUtils";
import { getBackEndUrl } from "../getBackEndUrl";
import { ARCGIS_TOKEN_SERVERS } from "../arcgisTokenRegistration";

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

  const servers = Array.from(
    new Set([...ARCGIS_TOKEN_SERVERS, ...extraServers].filter(Boolean))
  );

  if (useProxy) {
    const proxyUrl = `${backendUrl}/api/arcgis/proxy`;
    esriConfig.request.proxyUrl = proxyUrl;
    esriConfig.request.useIdentity = true;
    const backendHost = new URL(backendUrl).host;
    esriConfig.request.trustedServers = Array.from(
      new Set([...(esriConfig.request.trustedServers || []), backendHost])
    );
    ARCGIS_TOKEN_SERVERS.map((server) =>
      server.replace("/sharing/rest", "")
    )
      .filter((server, index, all) => all.indexOf(server) === index)
      .forEach((urlPrefix) => {
      urlUtils.addProxyRule({ urlPrefix, proxyUrl });
      });
  } else {
    esriConfig.request.useIdentity = true;
  }

  async function fetchAndRegister(): Promise<boolean> {
    const res = await fetch(tokenEndpoint, {
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("credential_token");
      localStorage.removeItem("credential_server");
      return false;
    }

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
    return true;
  }

  await fetchAndRegister();
  const intervalId = window.setInterval(() => {
    fetchAndRegister().catch((error) => {
      console.error("ArcGIS token refresh failed", error);
    });
  }, refreshEveryMs);

  return () => clearInterval(intervalId);
}

