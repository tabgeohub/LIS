import type { Request, Response } from "express";
import { getValidToken } from "../../services/arcgis";
import { resolvePlanPrincipal } from "../flightPlans/planAccess";
import { hasFinishedAtColumn } from "../../helpers/repositories/finishedPlansRepo";
import { pool } from "../../db";
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

    const finished_at_supported = await hasFinishedAtColumn(pool);
    res.json({
      version: 2,
      mode: "server_proxy",
      get_proxy_path: "api/arcgis/proxy",
      upload_contract: "existing_records_v2",
      plan_recovery_version: 1,
      new_point_upload_version: 1,
      finished_at_supported,
      max_photo_bytes: 16 * 1024 * 1024,
      persistent_claims: false,
      durable_operation_receipts: false,
      uncertain_writes: "reconcile_or_review",
      first_write_permits: "process_bound_single_use",
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
