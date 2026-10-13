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
  } catch (_error: unknown) {
    console.error("[arcgis] proxy POST request failed");
    res.status(500).json({
      code: "ARCGIS_PROXY_UNAVAILABLE",
      message: "ArcGIS proxy request failed",
    });
  }
}
