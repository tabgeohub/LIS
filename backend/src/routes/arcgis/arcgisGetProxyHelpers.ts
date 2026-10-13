import type { Request, Response } from "express";
import { fetch } from "undici";
import { getValidToken } from "../../services/arcgis";
import { extractTargetUrlFromRequest } from "./proxyShared";
import { assertAllowedArcgisHost } from "./postProxyTarget";

export function resolveArcgisGetProxyTarget(
  req: Request,
  res: Response
): string | null {
  const targetUrl = extractTargetUrlFromRequest(req);
  if (!targetUrl) {
    res.status(400).json({ error: "Missing url parameter" });
    return null;
  }

  const target = assertAllowedArcgisHost(targetUrl);
  if (!target) {
    res
      .status(400)
      .json({ error: `Target host not allowed: ${new URL(targetUrl).hostname}` });
    return null;
  }

  return targetUrl;
}

export async function fetchArcgisGetProxy(targetUrl: string) {
  const { access_token } = await getValidToken();
  const outgoing = new URL(targetUrl);
  if (!outgoing.searchParams.has("token")) {
    outgoing.searchParams.set("token", access_token);
  }

  const arcgisRes = await fetch(outgoing, {
    headers: { Accept: "application/json" },
  });

  return {
    status: arcgisRes.status,
    contentType: arcgisRes.headers.get("content-type"),
    body: Buffer.from(await arcgisRes.arrayBuffer()),
  };
}

export function sendArcgisProxyError(res: Response, _error: unknown): void {
  // A provider error can include request details. Keep server-side logging and
  // the client response stable and free of provider/token text.
  console.error("[arcgis] proxy request failed");
  res.status(500).json({
    code: "ARCGIS_PROXY_UNAVAILABLE",
    message: "ArcGIS proxy request failed",
  });
}
