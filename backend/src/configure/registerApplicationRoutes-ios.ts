import type { Express, ErrorRequestHandler } from "express";

export const IOS_PROBE_ROUTE = "/api/ios/bootstrap/probe";
export const IOS_PROBE_RESPONSE = Object.freeze({
  service: "lis-ios-bootstrap",
  version: 1,
  status: "ready",
  scope: "bootstrap-only",
});

export function registerApplicationRoutesIos(app: Express): void {
  // Public process/registry readiness, NOT database, authentication or ArcGIS health.
  app.get(IOS_PROBE_ROUTE, (_req, res) => { res.status(200).json(IOS_PROBE_RESPONSE); });
  // /auth2-ios and business /api/ios/* routers remain PLANNED until their owning steps.
  app.use((_req, res) => { res.status(404).json({ error: "not_found", version: 1 }); });
  const errors: ErrorRequestHandler = (error, _req, res, next) => {
    if (res.headersSent) { next(error); return; }
    const status = error?.status === 400 ? 400 : error?.status === 413 ? 413 :
      error?.status === 415 ? 415 : 500;
    const code = status === 400 ? "invalid_request" : status === 413 ? "request_too_large" :
      status === 415 ? "unsupported_encoding" : "internal_error";
    res.status(status).json({ error: code, version: 1 });
  };
  app.use(errors);
}
