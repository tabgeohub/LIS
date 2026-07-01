import express from "express";
import path from "path";

export const DOWNLOAD_PASSWORD = process.env.DOWNLOAD_PASSWORD || "password";
export const uploadsDir = path.join(__dirname, "..", "uploads");

function parseBasicAuth(header?: string) {
  if (!header) return null;
  const m = header.match(/^Basic\s+(.+)$/i);
  if (!m) return null;
  try {
    const decoded = Buffer.from(m[1], "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx < 0) return null;
    return { pass: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

export function requirePassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!DOWNLOAD_PASSWORD) return next();

  const creds = parseBasicAuth(req.headers.authorization);
  const ok = creds && creds.pass === DOWNLOAD_PASSWORD;
  if (!ok) {
    res.setHeader(
      "WWW-Authenticate",
      'Basic realm="Secure Download", charset="UTF-8"'
    );
    res.status(401).send("Authentication required");
    return;
  }
  next();
}
