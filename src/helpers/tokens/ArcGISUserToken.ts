import { getBackEndUrl } from "../getBackEndUrl";
import { ARCGIS_TOKEN_SERVERS } from "../arcgisTokenRegistration";
import {
  configureArcGisProxy,
  enableArcGisIdentity,
} from "./configureArcGisProxy";
import { fetchAndRegisterArcGisToken } from "./fetchAndRegisterArcGisToken";

type RefreshOptions = {
  useProxy?: boolean;
  refreshEveryMs?: number;
  extraServers?: string[];
};

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

  if (useProxy) configureArcGisProxy(backendUrl);
  else enableArcGisIdentity();

  const fetchAndRegister = () =>
    fetchAndRegisterArcGisToken(tokenEndpoint, servers);

  await fetchAndRegister();
  const intervalId = window.setInterval(() => {
    fetchAndRegister().catch((error) => {
      console.error("ArcGIS token refresh failed", error);
    });
  }, refreshEveryMs);

  return () => clearInterval(intervalId);
}
