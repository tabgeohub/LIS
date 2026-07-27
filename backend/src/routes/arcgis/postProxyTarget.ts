import type { Request } from "express";
import { ALLOWED_ARCGIS_HOSTS } from "../../config/allowlist";
import { decodeMaybeEncodedUrl, extractTargetUrlFromRequest } from "./proxyShared";

function isUrlEncodedFormBody(req: Request): boolean {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) return false;
  const contentType = req.headers["content-type"] || "";
  return contentType.includes("application/x-www-form-urlencoded");
}

function extractUrlFromFormBody(req: Request): string | null {
  if (!isUrlEncodedFormBody(req)) return null;

  const urlParam = new URLSearchParams(req.body.toString("utf8")).get("url");
  return urlParam ? decodeMaybeEncodedUrl(urlParam) : null;
}

export function resolvePostProxyTargetUrl(req: Request): string | null {
  return extractTargetUrlFromRequest(req) ?? extractUrlFromFormBody(req);
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

function validationFailure(
  status: number,
  error: string
): Extract<PostProxyValidation, { ok: false }> {
  return { ok: false, status, body: { error } };
}

export function validatePostProxyRequest(req: Request): PostProxyValidation {
  const targetUrl = resolvePostProxyTargetUrl(req);
  if (!targetUrl) {
    return validationFailure(400, "Missing url parameter");
  }

  const target = assertAllowedArcgisHost(targetUrl);
  if (!target) {
    return validationFailure(
      400,
      `Target host not allowed: ${new URL(targetUrl).hostname}`
    );
  }

  return { ok: true, targetUrl };
}
