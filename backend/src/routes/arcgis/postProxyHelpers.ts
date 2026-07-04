import type { Request } from "express";
import { fetch } from "undici";
import { getValidToken } from "../../services/arcgis";
import { validatePostProxyRequest } from "./postProxyTarget";

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

function hasUrlencodedBody(req: Request): boolean {
  const contentType = req.headers["content-type"] || "";
  return (
    contentType.includes("application/x-www-form-urlencoded") &&
    Buffer.isBuffer(req.body) &&
    req.body.length > 0
  );
}

export async function forwardArcgisPostRequest(req: Request) {
  const validation = validatePostProxyRequest(req);
  if (!validation.ok) {
    return { ok: false as const, status: validation.status, body: validation.body };
  }

  const { access_token } = await getValidToken();
  const contentType = req.headers["content-type"] || "";
  const arcgisRes = hasUrlencodedBody(req)
    ? await postUrlencodedToArcgis({
        targetUrl: validation.targetUrl,
        body: req.body as Buffer,
        accessToken: access_token,
      })
    : await postBodyToArcgis({
        targetUrl: validation.targetUrl,
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
