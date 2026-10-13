import type { Request, Response } from "express";
import { getValidToken } from "../../services/arcgis";
import { resolvePlanPrincipal } from "../flightPlans/planAccess";
import {
  fetchArcgisGetProxy,
  resolveArcgisGetProxyTarget,
  sendArcgisProxyError,
} from "./arcgisGetProxyHelpers";

export async function handleArcgisTokenRequest(_req: Request, res: Response) {
  try {
    const token = await getValidToken();
    res.json(token);
  } catch (_error: unknown) {
    // Provider error text can contain untrusted response details. Do not expose
    // it through the authenticated API or write it to application logs.
    console.error("[arcgis] token request failed");
    res.status(502).json({
      code: "ARCGIS_TOKEN_UNAVAILABLE",
      message: "ArcGIS token is unavailable",
    });
  }
}

/**
 * Contract consumed by native clients. It deliberately returns a backend proxy
 * capability, never a provider access token, OAuth client secret, or identity.
 *
 * `requireSessionAuth` protects this route before it is mounted. A second
 * Keycloak identity check ensures a fresh cookie alone cannot establish the
 * native ArcGIS capability.
 */
export async function handleArcgisIOSCredentialContract(
  req: Request,
  res: Response
) {
  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) {
      res.status(403).json({
        code: "ARCGIS_IDENTITY_UNAVAILABLE",
        message: "A Keycloak identity is required for ArcGIS proxy access",
      });
      return;
    }

    res.json({
      version: 1,
      mode: "server_proxy",
      get_proxy_path: "api/arcgis/proxy",
    });
  } catch (_error: unknown) {
    console.error("[arcgis] iOS credential contract failed");
    res.status(503).json({
      code: "ARCGIS_CAPABILITY_UNAVAILABLE",
      message: "ArcGIS proxy capability is unavailable",
    });
  }
}

export async function handleArcgisGetProxy(req: Request, res: Response) {
  try {
    const targetUrl = resolveArcgisGetProxyTarget(req, res);
    if (!targetUrl) return;

    const proxied = await fetchArcgisGetProxy(targetUrl);
    res.status(proxied.status);
    if (proxied.contentType) res.setHeader("content-type", proxied.contentType);
    res.send(proxied.body);
  } catch (e: unknown) {
    sendArcgisProxyError(res, e);
  }
}
