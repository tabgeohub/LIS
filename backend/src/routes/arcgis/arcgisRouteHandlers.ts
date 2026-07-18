import type { Request, Response } from "express";
import { getValidToken } from "../../services/arcgis";
import {
  fetchArcgisGetProxy,
  resolveArcgisGetProxyTarget,
  sendArcgisProxyError,
} from "./arcgisGetProxyHelpers";

export async function handleArcgisTokenRequest(_req: Request, res: Response) {
  try {
    const token = await getValidToken();
    res.json(token);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("[arcgis] token error:", errorMessage);
    res.status(502).json({ error: "Failed to obtain token: " + errorMessage });
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
