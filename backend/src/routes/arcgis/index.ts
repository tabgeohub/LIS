import { Router } from "express";
import { getValidToken } from "../../services/arcgis";
import { ALLOWED_ARCGIS_HOSTS } from "../../config/allowlist";
import { fetch } from "undici";

const router = Router();
const HTTP_PREFIX_RE = /^https?:\/\//i;
const ENCODED_HTTP_PREFIX_RE = /^https?%3A%2F%2F/i;

function decodeMaybeEncodedUrl(value: string): string {
  if (ENCODED_HTTP_PREFIX_RE.test(value)) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return value;
}

function extractFromRawQuery(rawQuery: string): string | null {
  if (!rawQuery) return null;

  // Preferred style: ?url=<encoded-or-plain-url>
  if (rawQuery.startsWith("url=")) {
    return decodeMaybeEncodedUrl(rawQuery.slice(4));
  }

  // Legacy style: ?https://host/path?... (not encoded)
  if (HTTP_PREFIX_RE.test(rawQuery) || ENCODED_HTTP_PREFIX_RE.test(rawQuery)) {
    return decodeMaybeEncodedUrl(rawQuery);
  }

  return null;
}

function extractTargetUrlFromRequest(req: any): string | null {
  if (typeof req.query?.url === "string" && req.query.url) {
    return decodeMaybeEncodedUrl(req.query.url);
  }

  const original = req.originalUrl || req.url || "";
  const qIndex = original.indexOf("?");
  if (qIndex !== -1) {
    const rawQuery = original.slice(qIndex + 1);
    const parsed = extractFromRawQuery(rawQuery);
    if (parsed) return parsed;
  }

  // Fallbacks for malformed query parsing
  for (const key of Object.keys(req.query || {})) {
    const value = req.query[key];
    if (typeof value === "string") {
      const decodedValue = decodeMaybeEncodedUrl(value);
      if (HTTP_PREFIX_RE.test(decodedValue)) return decodedValue;
    }
    const decodedKey = decodeMaybeEncodedUrl(key);
    if (HTTP_PREFIX_RE.test(decodedKey)) return decodedKey;
  }

  return null;
}

router.get("/token", async (_req, res) => {
  try {
    const token = await getValidToken();
    res.json(token); // { access_token, expires_at }
  } catch (e: any) {
    const errorMessage = e?.message || e;
    console.error("[arcgis] token error:", errorMessage);
    res.status(502).json({ error: "Failed to obtain token: " + errorMessage });
  }
});

router.get("/proxy", async (req, res) => {
  try {
    const targetUrl = extractTargetUrlFromRequest(req);

    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const target = new URL(targetUrl);
    if (!ALLOWED_ARCGIS_HOSTS.includes(target.hostname)) {
      return res
        .status(400)
        .json({ error: `Target host not allowed: ${target.hostname}` });
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
  } catch (e: any) {
    console.error("[arcgis] proxy error:", e);
    res.status(500).json({
      error: "Proxy request failed: " + (e?.message || "Unknown error"),
    });
  }
});

router.post("/proxy", async (req, res) => {
  try {
    let targetUrl: string | null = null;

    if (req.body?.url) {
      targetUrl = req.body.url;
    } else if (typeof req.body === "string" && req.body.startsWith("http")) {
      targetUrl = req.body;
    } else {
      targetUrl = extractTargetUrlFromRequest(req);
    }

    if (!targetUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const target = new URL(targetUrl);
    if (!ALLOWED_ARCGIS_HOSTS.includes(target.hostname)) {
      return res.status(400).json({ error: "Target host not allowed" });
    }

    const { access_token } = await getValidToken();

    const outgoing = new URL(targetUrl);
    if (!outgoing.searchParams.has("token")) {
      outgoing.searchParams.set("token", access_token);
    }

    const arcgisRes = await fetch(outgoing, {
      method: req.method,
      headers: {
        Accept: "application/json",
        ...(req.body && typeof req.body === "object"
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body: typeof req.body === "string" ? req.body : undefined,
    });

    res.status(arcgisRes.status);
    const ct = arcgisRes.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);
    const buf = Buffer.from(await arcgisRes.arrayBuffer());
    res.send(buf);
  } catch (e: any) {
    console.error("[arcgis] proxy POST error:", e);
    res.status(500).json({
      error: "Proxy request failed: " + (e?.message || "Unknown error"),
    });
  }
});

export default router;
