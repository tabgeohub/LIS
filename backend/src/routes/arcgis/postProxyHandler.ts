import type { Request, Response } from "express";
import { fetch } from "undici";
import { getValidToken } from "../../services/arcgis";
import { ALLOWED_ARCGIS_HOSTS } from "../../config/allowlist";
import { decodeMaybeEncodedUrl, extractTargetUrlFromRequest } from "./proxyShared";

/**
 * ArcGIS JS sends applyEdits / addAttachment as POST with a form or multipart body.
 * For application/x-www-form-urlencoded, ArcGIS Hosted layers can return
 * "Cannot perform query. Invalid query parameters" if auth `token` is only on the
 * URL query string — the server mis-handles the request. Merge token into the body
 * and POST to path-only URL (no query string).
 */
export default async function arcgisPostProxyHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    let targetUrl = extractTargetUrlFromRequest(req);

    if (!targetUrl && Buffer.isBuffer(req.body) && req.body.length > 0) {
      const ct = req.headers["content-type"] || "";
      if (ct.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(req.body.toString("utf8"));
        const urlParam = params.get("url");
        if (urlParam) {
          targetUrl = decodeMaybeEncodedUrl(urlParam);
        }
      }
    }

    if (!targetUrl) {
      res.status(400).json({ error: "Missing url parameter" });
      return;
    }

    const target = new URL(targetUrl);
    if (!ALLOWED_ARCGIS_HOSTS.includes(target.hostname)) {
      res.status(400).json({ error: `Target host not allowed: ${target.hostname}` });
      return;
    }

    const { access_token } = await getValidToken();
    const outgoing = new URL(targetUrl);
    const contentType = req.headers["content-type"] || "";

    const hasUrlencodedBody =
      contentType.includes("application/x-www-form-urlencoded") &&
      Buffer.isBuffer(req.body) &&
      req.body.length > 0;

    let arcgisRes: Awaited<ReturnType<typeof fetch>>;

    if (hasUrlencodedBody) {
      const merged = new URLSearchParams(req.body.toString("utf8"));
      outgoing.searchParams.forEach((value, key) => {
        if (!merged.has(key)) {
          merged.set(key, value);
        }
      });
      if (!merged.has("token")) {
        merged.set("token", access_token);
      }

      const pathOnly = `${outgoing.origin}${outgoing.pathname}`;
      arcgisRes = await fetch(pathOnly, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: merged.toString(),
      });
    } else {
      if (!outgoing.searchParams.has("token")) {
        outgoing.searchParams.set("token", access_token);
      }

      const forwardHeaders: Record<string, string> = {
        Accept: "application/json",
      };
      if (contentType) {
        forwardHeaders["Content-Type"] = contentType;
      }

      const body =
        Buffer.isBuffer(req.body) && req.body.length > 0 ? req.body : undefined;

      arcgisRes = await fetch(outgoing, {
        method: "POST",
        headers: forwardHeaders,
        body,
      });
    }

    res.status(arcgisRes.status);
    const resCt = arcgisRes.headers.get("content-type");
    if (resCt) res.setHeader("content-type", resCt);
    const buf = Buffer.from(await arcgisRes.arrayBuffer());
    res.send(buf);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[arcgis] proxy POST error:", e);
    res.status(500).json({
      error: "Proxy request failed: " + message,
    });
  }
}
