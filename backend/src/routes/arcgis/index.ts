import { Router } from "express";
import { getValidToken } from "../../services/arcgis";
import { ALLOWED_ARCGIS_HOSTS } from "../../config/allowlist";
import { fetch } from "undici";

const router = Router();

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
    let targetUrl: string | null = null;

    if (req.query.url) {
      targetUrl = decodeURIComponent(req.query.url as string);
    } else {
      const queryKeys = Object.keys(req.query);
      for (const key of queryKeys) {
        const value = req.query[key];
        if (typeof value === "string") {
          try {
            const decoded = decodeURIComponent(value);
            if (
              decoded.startsWith("http://") ||
              decoded.startsWith("https://")
            ) {
              targetUrl = decoded;
              break;
            }
          } catch {}
          if (value.startsWith("http://") || value.startsWith("https://")) {
            targetUrl = value;
            break;
          }
        }
      }

      if (!targetUrl && req.url) {
        const urlMatch = req.url.match(/[?&](https?%3A%2F%2F[^\s&]+)/);
        if (urlMatch) {
          targetUrl = decodeURIComponent(urlMatch[1]);
        } else {
          const urlMatch2 = req.url.match(/[?&](https?:\/\/[^\s&]+)/);
          if (urlMatch2) {
            targetUrl = urlMatch2[1];
          }
        }
      }
    }

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
    } else if (req.query.url) {
      targetUrl = req.query.url as string;
    } else if (typeof req.body === "string" && req.body.startsWith("http")) {
      targetUrl = req.body;
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
