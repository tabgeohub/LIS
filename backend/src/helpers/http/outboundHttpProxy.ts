import { ProxyAgent, setGlobalDispatcher } from "undici";

/**
 * Same corporate proxy resolution as OIDC (openid-client):
 * HTTPS_PROXY / https_proxy / HTTP_PROXY / http_proxy.
 */
export function getCorporateProxyUrl(): string | undefined {
  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  return proxyUrl?.trim() || undefined;
}

let undiciProxyInitialized = false;

/**
 * Route undici `fetch` through the corporate proxy when configured.
 * Used by Keycloak Admin API and ArcGIS token calls in acceptance.
 * Local/dev with no proxy env vars is unchanged.
 */
export function ensureUndiciCorporateProxy(): void {
  if (undiciProxyInitialized) {
    return;
  }
  undiciProxyInitialized = true;

  const proxyUrl = getCorporateProxyUrl();
  if (!proxyUrl) {
    return;
  }

  setGlobalDispatcher(new ProxyAgent(proxyUrl));
  console.log("[http] undici outbound configured via proxy:", proxyUrl);
}
