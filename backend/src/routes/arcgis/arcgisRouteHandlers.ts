import type { Request, Response } from "express";
import { fetch } from "undici";
import { getValidToken } from "../../services/arcgis";
import { extractTargetUrlFromRequest } from "./proxyShared";
import { assertAllowedArcgisHost } from "./postProxyTarget";

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
    const targetUrl = extractTargetUrlFromRequest(req);
    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const target = assertAllowedArcgisHost(targetUrl);
    if (!target) {
      return res
        .status(400)
        .json({ error: `Target host not allowed: ${new URL(targetUrl).hostname}` });
    }

    const { access_token } = await getValidToken();
    const outgoing = new URL(targetUrl);
    if (!outgoing.searchParams.has("token")) {
      outgoing.searchParams.set("token", access_token);
    }

    const arcgisRes = await fetch(outgoing, {
      headers: { Accept: "application/json" },
    });

    res.status(arcgisRes.status);
    const ct = arcgisRes.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);
    const buf = Buffer.from(await arcgisRes.arrayBuffer());
    res.send(buf);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[arcgis] proxy error:", e);
    res.status(500).json({ error: "Proxy request failed: " + message });
  }
}
