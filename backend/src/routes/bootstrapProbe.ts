import { Router } from "express";

/**
 * Local-only composition check for the existing LIS backend. This confirms
 * that Express has completed request middleware and route registration; it
 * intentionally does not check authentication, database, Redis, or ArcGIS.
 */
export const BOOTSTRAP_PROBE_PATH = "/api/ios/bootstrap/probe";

export const BOOTSTRAP_PROBE_RESPONSE = {
  service: "lis-backend",
  version: 1,
  status: "ready",
  scope: "bootstrap-only",
} as const;

export function createBootstrapProbeRouter(): Router {
  const router = Router();

  router.get("/probe", (_req, res) => {
    res.status(200).json(BOOTSTRAP_PROBE_RESPONSE);
  });

  return router;
}
