import type { Request } from "express";
import { ALLOWED_ARCGIS_HOSTS } from "../../config/allowlist";
import { decodeMaybeEncodedUrl, extractTargetUrlFromRequest } from "./proxyShared";

export function resolvePostProxyTargetUrl(req: Request): string | null {
  let targetUrl = extractTargetUrlFromRequest(req);

  if (!targetUrl && Buffer.isBuffer(req.body) && req.body.length > 0) {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(req.body.toString("utf8"));
      const urlParam = params.get("url");
      if (urlParam) targetUrl = decodeMaybeEncodedUrl(urlParam);
    }
  }

  return targetUrl;
}

export function assertAllowedArcgisHost(targetUrl: string): URL | null {
  try {
    const target = new URL(targetUrl);
    if (!ALLOWED_ARCGIS_HOSTS.includes(target.hostname)) return null;
    return target;
  } catch {
    return null;
  }
}

export type PostProxyValidation =
  | { ok: false; status: number; body: { error: string } }
  | { ok: true; targetUrl: string };

export function validatePostProxyRequest(req: Request): PostProxyValidation {
  const targetUrl = resolvePostProxyTargetUrl(req);
  if (!targetUrl) {
    return { ok: false, status: 400, body: { error: "Missing url parameter" } };
  }

  const target = assertAllowedArcgisHost(targetUrl);
  if (!target) {
    return {
      ok: false,
      status: 400,
      body: { error: `Target host not allowed: ${new URL(targetUrl).hostname}` },
    };
  }

  return { ok: true, targetUrl };
}
