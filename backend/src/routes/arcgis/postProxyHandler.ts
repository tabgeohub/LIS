import type { Request, Response } from "express";
import { forwardArcgisPostRequest } from "./postProxyHelpers";

export default async function arcgisPostProxyHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await forwardArcgisPostRequest(req);

    if (!result.ok) {
      res.status(result.status).json(result.body);
      return;
    }

    res.status(result.status);
    if (result.contentType) res.setHeader("content-type", result.contentType);
    res.send(result.body);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[arcgis] proxy POST error:", e);
    res.status(500).json({ error: "Proxy request failed: " + message });
  }
}
