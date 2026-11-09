import { Router, type Request, type Response } from "express";
import type { SignedExport } from "../../migrations/exportContract";
import { pool } from "../../db";
import { createRequireAdmin, getRealmRoles } from "../../helpers/auth/realmAdminAuth";
import { decodeJwtPayload } from "../auth/jwt";
import { resolveAuthenticatedIdentity } from "../auth2/authIdentity";
import { migrationConfig, configuredForDestination, configuredForSource } from "./config";
import { buildProposal, importPayload, selectableRegions, verifyExport, verifyPhotoReferences } from "./destination";
import { captureFlightSnapshot } from "./sourceSnapshot";
import { migrationApiError, migrationCsrf, requireMigrationCsrf } from "./security";

const router = Router();
/** No server-to-server transfer endpoint is mounted for the one-shot flow. */
export const migrationInternalRouter = Router();
type Actor = { subject: string; issuer: string };

function config(req: Request) { return migrationConfig(req.hostname); }
function disabled(res: Response) { res.status(404).json({ code: "MIGRATION_DISABLED", message: "Flight transfer is disabled" }); }
function sourceReady(configured: ReturnType<typeof config>) { return configuredForSource(configured); }
function destinationReady(configured: ReturnType<typeof config>) { return configuredForDestination(configured); }
async function actor(req: Request): Promise<Actor> {
  const auth = req.session.auth;
  if (!auth) throw new Error("ADMIN_IDENTITY_UNAVAILABLE");
  const identity = await resolveAuthenticatedIdentity({ tokenSet: auth.tokenSet, userInfo: auth.userInfo });
  if (!identity || !identity.is_admin || !getRealmRoles(req).includes("admin")) throw new Error("ADMIN_ROLE_REQUIRED");
  const issuer = decodeJwtPayload<{ iss?: unknown }>(auth.tokenSet.access_token || "")?.iss;
  if (typeof issuer !== "string" || !issuer) throw new Error("ADMIN_ISSUER_UNAVAILABLE");
  return { subject: identity.subject, issuer };
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
  if (typeof req.body?.destinationRegion !== "string" || !req.body.destinationRegion) throw new Error("INVALID_REGION");
  return req.body.destinationRegion;
}

router.get("/mode", createRequireAdmin("Exact admin role required"), (req, res) => {
  const configured = config(req);
  if (sourceReady(configured)) { res.json({ mode: "source", readOnly: configured.readOnly, csrfToken: migrationCsrf(req) }); return; }
  if (destinationReady(configured)) { res.json({ mode: "destination", csrfToken: migrationCsrf(req) }); return; }
  disabled(res);
});

router.get("/flights", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req);
  if (!sourceReady(configured)) { disabled(res); return; }
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 50);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  try {
    const result = await pool.query(
      `SELECT fp.id, fp.vluchtnummer, fp.datum, fp.regio_id,
              (SELECT count(*)::int FROM lis.finished_plans f WHERE f.plan_id = fp.id) AS completion_count
         FROM lis.flightplans fp
        WHERE fp.status = 'finished'
        ORDER BY fp.datum DESC NULLS LAST, fp.id DESC
        LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({
      flights: result.rows.map(row => ({ ...row, migrationStatus: row.completion_count > 0 ? "Ready" : "Needs review" })),
      limit, offset, readOnly: configured.readOnly, csrfToken: migrationCsrf(req),
    });
  } catch (error) { migrationApiError(res, error); }
});

/** Produces a signed download only; no export is saved in a database. */
router.post("/flights/:id/exports", createRequireAdmin("Exact admin role required"), requireMigrationCsrf, async (req, res) => {
  const configured = config(req);
  if (!sourceReady(configured)) { disabled(res); return; }
  if (configured.readOnly) { res.status(403).json({ code: "MIGRATION_READ_ONLY", message: "Local mode lists flights only" }); return; }
  try {
    const current = await actor(req);
    const envelope = await captureFlightSnapshot(pool, req.params.id, current, configured);
    res.json({ envelope, expiresAt: envelope.payload.expiresAt, fileName: `lis-finished-flight-${envelope.payload.source.flightId}.json` });
  } catch (error) { migrationApiError(res, error); }
});

router.get("/regions", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req);
  if (!destinationReady(configured)) { disabled(res); return; }
  try { res.json({ regions: await destinationRegions(req), csrfToken: migrationCsrf(req) }); }
  catch (error) { migrationApiError(res, error); }
});

/** Preview is request-scoped and is never stored. */
router.post("/imports/preview", createRequireAdmin("Exact admin role required"), requireMigrationCsrf, async (req, res) => {
  const configured = config(req);
  if (!destinationReady(configured)) { disabled(res); return; }
  try {
    const region = selectedRegion(req);
    if (!(await destinationRegions(req)).includes(region)) throw new Error("INVALID_REGION");
    const payload = verifyExport(readEnvelope(req), configured.trustedPublicKeys);
    if (payload.source.instance !== configured.sourceInstance) throw new Error("INVALID_EXPORT_SOURCE");
    if (!(await verifyPhotoReferences(payload, configured.arcgisAllowedOrigins))) throw new Error("PHOTOS_UNAVAILABLE");
    const client = await pool.connect();
    try { const proposal = await buildProposal(client, payload, region); res.json({ source: { environment: payload.source.environment, flightId: payload.source.flightId, flightNumber: (payload.records.flight as Record<string, unknown>).vluchtnummer ?? payload.source.flightId, flightDate: (payload.records.flight as Record<string, unknown>).datum ?? null }, region, proposal }); }
    finally { client.release(); }
  } catch (error) { migrationApiError(res, error); }
});

/** One transaction, no durable operation record. A lost response must not be retried blindly. */
router.post("/imports", createRequireAdmin("Exact admin role required"), requireMigrationCsrf, async (req, res) => {
  const configured = config(req);
  if (!destinationReady(configured)) { disabled(res); return; }
  try {
    const region = selectedRegion(req);
    if (!(await destinationRegions(req)).includes(region)) throw new Error("INVALID_REGION");
    const payload = verifyExport(readEnvelope(req), configured.trustedPublicKeys);
    if (payload.source.instance !== configured.sourceInstance) throw new Error("INVALID_EXPORT_SOURCE");
    if (!(await verifyPhotoReferences(payload, configured.arcgisAllowedOrigins))) throw new Error("PHOTOS_UNAVAILABLE");
    const current = await actor(req);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const imported = await importPayload(client, payload, region, current);
      await client.query("COMMIT");
      res.status(201).json({ destinationFlightId: imported.destinationFlightId, region, mappings: imported.mappings });
    } catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; }
    finally { client.release(); }
  } catch (error) { migrationApiError(res, error); }
});

export default router;
