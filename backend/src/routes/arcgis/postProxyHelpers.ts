import type { Request } from "express";
import { fetch } from "undici";
import { getValidToken } from "../../services/arcgis";
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

async function postUrlencodedToArcgis(input: {
  targetUrl: string;
  body: Buffer;
  accessToken: string;
}) {
  const outgoing = new URL(input.targetUrl);
  const merged = new URLSearchParams(input.body.toString("utf8"));

  outgoing.searchParams.forEach((value, key) => {
    if (!merged.has(key)) merged.set(key, value);
  });
  if (!merged.has("token")) merged.set("token", input.accessToken);

  const pathOnly = `${outgoing.origin}${outgoing.pathname}`;
  return fetch(pathOnly, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: merged.toString(),
  });
}

async function postBodyToArcgis(input: {
  targetUrl: string;
  contentType: string;
  body: Buffer | undefined;
  accessToken: string;
}) {
  const outgoing = new URL(input.targetUrl);
  if (!outgoing.searchParams.has("token")) {
    outgoing.searchParams.set("token", input.accessToken);
  }

  const forwardHeaders: Record<string, string> = { Accept: "application/json" };
  if (input.contentType) forwardHeaders["Content-Type"] = input.contentType;

  return fetch(outgoing, {
    method: "POST",
    headers: forwardHeaders,
    body: input.body,
  });
}

export async function forwardArcgisPostRequest(req: Request) {
  const targetUrl = resolvePostProxyTargetUrl(req);
  if (!targetUrl) {
    return { ok: false as const, status: 400, body: { error: "Missing url parameter" } };
  }

  const target = assertAllowedArcgisHost(targetUrl);
  if (!target) {
    return {
      ok: false as const,
      status: 400,
      body: { error: `Target host not allowed: ${new URL(targetUrl).hostname}` },
    };
  }

  const { access_token } = await getValidToken();
  const contentType = req.headers["content-type"] || "";
  const hasUrlencodedBody =
    contentType.includes("application/x-www-form-urlencoded") &&
    Buffer.isBuffer(req.body) &&
    req.body.length > 0;

  const arcgisRes = hasUrlencodedBody
    ? await postUrlencodedToArcgis({
        targetUrl,
        body: req.body as Buffer,
        accessToken: access_token,
      })
    : await postBodyToArcgis({
        targetUrl,
        contentType,
        body:
          Buffer.isBuffer(req.body) && req.body.length > 0
            ? (req.body as Buffer)
            : undefined,
        accessToken: access_token,
      });

  const buf = Buffer.from(await arcgisRes.arrayBuffer());
  return {
    ok: true as const,
    status: arcgisRes.status,
    contentType: arcgisRes.headers.get("content-type"),
    body: buf,
  };
}
