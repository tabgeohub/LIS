import { Router, type Request, type RequestHandler, type Response } from "express";
import { pool } from "../../db";
import type { SignedExport } from "../../migrations/exportContract";
import { getRealmRoles } from "../../helpers/auth/realmAdminAuth";
import { decodeJwtPayload } from "../auth/jwt";
import { migrationConfig, isProdHostname, isTrustedTstSource } from "./config";
import { buildProposal, importPayload, selectableRegions, verifyPhotoReferences } from "./destination";
import { verifyExport } from "../../migrations/exportContract";
import { migrationApiError, migrationCsrf, requireMigrationCsrf } from "./security";

const router = Router();
type Actor = { subject: string; issuer: string };

function browserHostname(req: Request): string | undefined {
  for (const value of [req.get("origin"), req.get("referer")]) {
    if (!value) continue;
    try { return new URL(value).hostname; } catch { /* next header */ }
  }
  return undefined;
}

/** A reverse proxy may pass its internal host; only the configured public origin can enable this route. */
function config(req: Request) {
  return isProdHostname(req.hostname) || isProdHostname(browserHostname(req) || "")
    ? migrationConfig("lis.rws.nl")
    : migrationConfig(req.hostname);
}

function disabled(res: Response): void {
  res.status(404).json({ code: "MIGRATION_DISABLED", message: "Finished-flight import is disabled" });
}

const requireExactAdmin: RequestHandler = (req, res, next) => {
  if (!getRealmRoles(req).includes("admin")) {
    res.status(403).json({ code: "ADMIN_ROLE_REQUIRED", message: "The exact admin realm role is required" });
    return;
  }
  next();
};

function actor(req: Request): Actor {
  const token = req.session.auth?.tokenSet.access_token || "";
  const claims = decodeJwtPayload<{ sub?: unknown; iss?: unknown }>(token);
  if (!claims || typeof claims.sub !== "string" || !claims.sub || typeof claims.iss !== "string" || !claims.iss) throw new Error("ADMIN_IDENTITY_UNAVAILABLE");
  return { subject: claims.sub, issuer: claims.iss };
}

async function destinationRegions(req: Request): Promise<string[]> {
  const roles = getRealmRoles(req).filter(role => role !== "admin");
  if (!roles.length) throw new Error("DESTINATION_ROLES_UNAVAILABLE");
  return selectableRegions(pool, roles);
}

function readEnvelope(req: Request): SignedExport {
  const value = req.body?.envelope;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_EXPORT");
  return value as SignedExport;
}

function selectedRegion(req: Request): string {
  const region = req.body?.destinationRegion;
  if (typeof region !== "string" || !region) throw new Error("INVALID_REGION");
  return region;
}

async function validatedPayload(req: Request) {
  const configured = config(req);
  if (!configured.enabled) throw new Error("MIGRATION_DISABLED");
  const region = selectedRegion(req);
  if (!(await destinationRegions(req)).includes(region)) throw new Error("INVALID_REGION");
  const payload = verifyExport(readEnvelope(req), configured.trustedPublicKeys);
  if (!isTrustedTstSource(payload.source)) throw new Error("INVALID_EXPORT_SOURCE");
  if (!(await verifyPhotoReferences(payload, configured.arcgisAllowedOrigins))) throw new Error("PHOTOS_UNAVAILABLE");
  return { configured, payload, region };
}

function sourceSummary(payload: Awaited<ReturnType<typeof validatedPayload>>["payload"]) {
  const flight = payload.records.flight && typeof payload.records.flight === "object" && !Array.isArray(payload.records.flight) ? payload.records.flight as Record<string, unknown> : {};
  return { environment: payload.source.environment, flightId: payload.source.flightId, flightNumber: flight.vluchtnummer ?? payload.source.flightId, flightDate: flight.datum ?? null };
}

router.get("/mode", requireExactAdmin, (req, res) => {
  const configured = config(req);
  if (!configured.enabled) { disabled(res); return; }
  res.json({ mode: "destination", csrfToken: migrationCsrf(req), packageStorage: false, retryRecovery: false });
});

router.get("/regions", requireExactAdmin, async (req, res) => {
  if (!config(req).enabled) { disabled(res); return; }
  try { res.json({ regions: await destinationRegions(req), csrfToken: migrationCsrf(req) }); }
  catch (error) { migrationApiError(res, error); }
});

router.post("/imports/preview", requireExactAdmin, requireMigrationCsrf, async (req, res) => {
  if (!config(req).enabled) { disabled(res); return; }
  try {
    const { payload, region } = await validatedPayload(req);
    const client = await pool.connect();
    try { res.json({ source: sourceSummary(payload), region, proposal: await buildProposal(client, payload, region) }); }
    finally { client.release(); }
  } catch (error) { migrationApiError(res, error); }
});

/** There is deliberately no idempotency table or retry record. A lost response must be checked manually. */
router.post("/imports", requireExactAdmin, requireMigrationCsrf, async (req, res) => {
  if (!config(req).enabled) { disabled(res); return; }
  try {
    const { payload, region } = await validatedPayload(req);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const imported = await importPayload(client, payload, region, actor(req), req.body?.confirmedRenames);
      await client.query("COMMIT");
      res.status(201).json({ destinationFlightId: imported.destinationFlightId, region, mappings: imported.mappings });
    } catch (error) {
      try { await client.query("ROLLBACK"); } catch { /* preserve original failure */ }
      throw error;
    } finally { client.release(); }
  } catch (error) { migrationApiError(res, error); }
});

export default router;
