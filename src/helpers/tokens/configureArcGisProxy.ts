import esriConfig from "@arcgis/core/config";
import * as urlUtils from "@arcgis/core/core/urlUtils";
import { ARCGIS_TOKEN_SERVERS } from "../auth/arcgisTokenRegistration";

export function configureArcGisProxy(backendUrl: string): void {
  const proxyUrl = `${backendUrl}/api/arcgis/proxy`;
  esriConfig.request.proxyUrl = proxyUrl;
  esriConfig.request.useIdentity = true;
  const backendHost = new URL(backendUrl).host;
  esriConfig.request.trustedServers = Array.from(
    new Set([...(esriConfig.request.trustedServers || []), backendHost])
  );
  ARCGIS_TOKEN_SERVERS.map((server) => server.replace("/sharing/rest", ""))
    .filter((server, index, all) => all.indexOf(server) === index)
    .forEach((urlPrefix) => {
      urlUtils.addProxyRule({ urlPrefix, proxyUrl });
    });
}

export function enableArcGisIdentity(): void {
  esriConfig.request.useIdentity = true;
}
