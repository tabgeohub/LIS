import { Router, type Request, type Response } from "express";
import { createHash } from "node:crypto";
import { request } from "undici";
import { pool } from "../../db";
import { createRequireAdmin, getRealmRoles } from "../../helpers/auth/realmAdminAuth";
import { decodeJwtPayload } from "../auth/jwt";
import { resolveAuthenticatedIdentity } from "../auth2/authIdentity";
import { canonicalJson, type Json } from "../../migrations/exportContract";
import { migrationConfig, configuredForDestination, configuredForSource } from "./config";
import { buildProposal, fetchSourceExport, importPayload, loadPreview, selectableRegions, storePreview, verifyExport, verifyPhotoReferences } from "./destination";
import { captureFlightSnapshot, createAndStoreSourceExport, currentFlightDigest } from "./sourceSnapshot";
import { hasServiceCredential, migrationApiError, migrationCsrf, requireMigrationCsrf } from "./security";
import { getAvailableRoles } from "../keycloak/management/users/getAvailableRoles";

const router = Router();
export const migrationInternalRouter = Router();
type Actor = { subject: string; issuer: string };
function sourceSummary(payload: { source: { environment: string; flightId: string }; records: { flight: Json } }) {
  const flight = payload.records.flight && typeof payload.records.flight === "object" && !Array.isArray(payload.records.flight) ? payload.records.flight as Record<string, Json> : {};
  return { environment: payload.source.environment, flightId: payload.source.flightId, flightNumber: typeof flight.vluchtnummer === "string" ? flight.vluchtnummer : payload.source.flightId, flightDate: typeof flight.datum === "string" ? flight.datum : null };
}
function config(req: Request) { return migrationConfig(req.hostname); }
function disabled(res: Response) { res.status(404).json({ code: "MIGRATION_DISABLED", message: "Flight migration is disabled" }); }
async function destinationRegions(req: Request, _configured: ReturnType<typeof config>): Promise<string[]> {
  const roles = await getAvailableRoles(req);
  if (!roles.realmRoles.length) throw new Error("DESTINATION_ROLES_UNAVAILABLE");
  return selectableRegions(pool, roles.realmRoles.map(role => role.name));
}
async function actor(req: Request): Promise<Actor> {
  const auth = req.session.auth;
  if (!auth) throw new Error("ADMIN_IDENTITY_UNAVAILABLE");
  const identity = await resolveAuthenticatedIdentity({ tokenSet: auth.tokenSet, userInfo: auth.userInfo });
  if (!identity || !identity.is_admin || !getRealmRoles(req).includes("admin")) throw new Error("ADMIN_ROLE_REQUIRED");
  const issuer = decodeJwtPayload<{ iss?: unknown }>(auth.tokenSet.access_token || "")?.iss;
  if (typeof issuer !== "string" || !issuer) throw new Error("ADMIN_ISSUER_UNAVAILABLE");
  return { subject: identity.subject, issuer };
}
function sourceExportUrl(id: string) { return `/internal/migrations/exports/${encodeURIComponent(id)}`; }
async function sourceDigest(configured: ReturnType<typeof config>, exportId: string): Promise<string> {
  const base = new URL(configured.sourceBackendUrl); const url = new URL(`${sourceExportUrl(exportId)}/digest`, base);
  if (url.origin !== base.origin) throw new Error("SOURCE_URL_REJECTED");
  const response = await request(url, { method: "GET", headers: { authorization: `Bearer ${configured.exportReadCredential}`, accept: "application/json" }, headersTimeout: 15000, bodyTimeout: 15000 });
  if (response.statusCode !== 200) throw new Error("SOURCE_EXPORT_UNAVAILABLE");
  const body = await response.body.json() as { digest?: unknown };
  if (typeof body.digest !== "string") throw new Error("SOURCE_EXPORT_UNAVAILABLE"); return body.digest;
}
function handoff(configured: ReturnType<typeof config>, sourceInstance: string, exportId: string): string {
  const url = new URL(`${configured.destinationFrontendUrl}/dashboard`); url.searchParams.set("migrationSource", sourceInstance); url.searchParams.set("migrationExport", exportId); return url.toString();
}
type SourceStatus = { migrationStatus: "Migrated" | "Ready" | "Status unavailable"; digest?: string };
async function destinationStatus(configured: ReturnType<typeof config>, flightId: string): Promise<SourceStatus> {
  if (!configured.statusBackendUrl || !configured.statusReadCredential) return { migrationStatus: "Status unavailable" };
  try {
    const base = new URL(configured.statusBackendUrl); const url = new URL(`/internal/migrations/status/${encodeURIComponent(configured.sourceInstance)}/${encodeURIComponent(flightId)}`, base);
    if (url.origin !== base.origin) return { migrationStatus: "Status unavailable" };
    const response = await request(url, { method: "GET", headers: { authorization: `Bearer ${configured.statusReadCredential}`, accept: "application/json" }, headersTimeout: 10000, bodyTimeout: 10000 });
    if (response.statusCode !== 200) return { migrationStatus: "Status unavailable" };
    const body = await response.body.json() as { operation_id?: unknown; export_digest?: unknown };
    return { migrationStatus: typeof body.operation_id === "string" ? "Migrated" : "Ready", ...(typeof body.export_digest === "string" ? { digest: body.export_digest } : {}) };
  } catch { return { migrationStatus: "Status unavailable" }; }
}
async function sourceChanged(configured: ReturnType<typeof config>, flightId: string, digest: string, current: Actor): Promise<boolean> {
  const saved = await pool.query<{ payload_canonical: Buffer }>("SELECT payload_canonical FROM lis.migration_exports WHERE source_instance=$1 AND source_flight_id=$2 AND digest=$3", [configured.sourceInstance, flightId, digest]);
  if (!saved.rows[0]) return false;
  const previous = JSON.parse(saved.rows[0].payload_canonical.toString("utf8")) as { records?: Json };
  if (!previous.records) return false;
  const latest = await captureFlightSnapshot(pool, flightId, current, configured);
  return canonicalJson(previous.records) !== canonicalJson(latest.payload.records as unknown as Json);
}

router.get("/flights", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req); if (!configuredForSource(configured)) { disabled(res); return; }
  const size = Math.min(Math.max(Number(req.query.limit) || 25, 1), 50); const offset = Math.max(Number(req.query.offset) || 0, 0);
  try {
    const current = await actor(req); const result = await pool.query("SELECT fp.id, fp.vluchtnummer, fp.datum, fp.regio_id, (SELECT count(*)::int FROM lis.finished_plans f WHERE f.plan_id=fp.id) AS completion_count FROM lis.flightplans fp WHERE fp.status='finished' ORDER BY fp.datum DESC NULLS LAST, fp.id DESC LIMIT $1 OFFSET $2", [size, offset]);
    const flights = await Promise.all(result.rows.map(async row => { const status = await destinationStatus(configured, String(row.id)); const changed = status.migrationStatus === "Migrated" && status.digest ? await sourceChanged(configured, String(row.id), status.digest, current) : false; return { ...row, migrationStatus: changed ? "Migrated; source changed" : status.migrationStatus === "Ready" && row.completion_count === 0 ? "Needs review" : status.migrationStatus }; }));
    res.json({ flights, limit: size, offset, csrfToken: migrationCsrf(req), readOnly: configured.readOnly });
  } catch (error) { migrationApiError(res, error); }
});
router.post("/flights/:id/handoffs", createRequireAdmin("Exact admin role required"), requireMigrationCsrf, async (req, res) => {
  const configured = config(req); if (!configuredForSource(configured)) { disabled(res); return; }
  if (configured.readOnly) { res.status(403).json({ code: "MIGRATION_READ_ONLY", message: "Local migration mode lists flights only" }); return; }
  try { const current = await actor(req); const signed = await createAndStoreSourceExport(pool, req.params.id, current, configured); res.status(201).json({ exportId: signed.payload.exportId, expiresAt: signed.payload.expiresAt, handoffUrl: handoff(configured, configured.sourceInstance, signed.payload.exportId) }); }
  catch (error) { migrationApiError(res, error); }
});
router.get("/regions", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req); if (!configuredForDestination(configured)) { disabled(res); return; }
  try { res.json({ regions: await destinationRegions(req, configured), csrfToken: migrationCsrf(req) }); }
  catch (error) { migrationApiError(res, error); }
});
router.post("/previews", createRequireAdmin("Exact admin role required"), requireMigrationCsrf, async (req, res) => {
  const configured = config(req); if (!configuredForDestination(configured)) { disabled(res); return; }
  try {
    const sourceInstance = typeof req.body?.sourceInstance === "string" ? req.body.sourceInstance : "";
    const exportId = typeof req.body?.exportId === "string" ? req.body.exportId : "";
    const region = typeof req.body?.destinationRegion === "string" ? req.body.destinationRegion : "";
    if (!exportId || sourceInstance !== configured.sourceInstance || !(await destinationRegions(req, configured)).includes(region)) throw new Error("INVALID_REGION");
    const current = await actor(req); const envelope = await fetchSourceExport(configured, exportId); const payload = verifyExport(envelope, configured.trustedPublicKeys);
    if (payload.source.instance !== configured.sourceInstance || payload.source.flightId === "") throw new Error("INVALID_EXPORT_SOURCE");
    if (!(await verifyPhotoReferences(payload, configured.arcgisAllowedOrigins))) throw new Error("PHOTOS_UNAVAILABLE");
    const client = await pool.connect(); try { const proposal = await buildProposal(client, payload, region); const preview = await storePreview(client, { payload, digest: envelope.digest, region, actor: current, proposal }); res.status(201).json({ previewId: preview.id, expiresAt: preview.expiresAt, source: sourceSummary(payload), region, proposal }); } finally { client.release(); }
  } catch (error) { migrationApiError(res, error); }
});
router.get("/previews/:id", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req); if (!configuredForDestination(configured)) { disabled(res); return; }
  try { const current = await actor(req); const preview = await loadPreview(pool, req.params.id); if (!preview || preview.actor_subject !== current.subject || preview.actor_issuer !== current.issuer) throw new Error("PREVIEW_NOT_FOUND"); const operation = await pool.query("SELECT operation_id,destination_flight_id,destination_region,completed_at FROM lis.migration_transfers WHERE operation_id=$1", [preview.preview_id]); res.json({ previewId: preview.preview_id, expiresAt: preview.expires_at, source: sourceSummary(preview.verified_export), region: preview.destination_region, proposal: preview.proposal, committed: operation.rows[0] || null }); } catch (error) { migrationApiError(res, error); }
});
router.post("/previews/:id/commit", createRequireAdmin("Exact admin role required"), requireMigrationCsrf, async (req, res) => {
  const configured = config(req); if (!configuredForDestination(configured)) { disabled(res); return; }
  try {
    const current = await actor(req); const preliminary = await loadPreview(pool, req.params.id);
    if (!preliminary || preliminary.actor_subject !== current.subject || preliminary.actor_issuer !== current.issuer || preliminary.expires_at.getTime() <= Date.now()) throw new Error("PREVIEW_EXPIRED");
    const expectedRecordsDigest = createHash("sha256").update(canonicalJson(preliminary.verified_export.records as unknown as Json)).digest("hex");
    if (await sourceDigest(configured, preliminary.export_id) !== expectedRecordsDigest) throw new Error("SOURCE_CHANGED");
    if (!(await verifyPhotoReferences(preliminary.verified_export, configured.arcgisAllowedOrigins))) throw new Error("PHOTOS_UNAVAILABLE");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Serialize attempts before checking uniqueness so a second admin sees the
      // committed transfer rather than losing to a unique-key error.
      await client.query("SELECT pg_advisory_xact_lock(hashtext('lis.migration.import'))");
      const preview = await loadPreview(client, req.params.id, true);
      if (!preview || preview.actor_subject !== current.subject || preview.actor_issuer !== current.issuer || preview.expires_at.getTime() <= Date.now()) throw new Error("PREVIEW_EXPIRED");
      const prior = await client.query<{ operation_id: string; destination_region: string; export_digest: string; destination_flight_id: string; completed_at: Date }>("SELECT * FROM lis.migration_transfers WHERE source_instance=$1 AND source_flight_id=$2 FOR UPDATE", [preview.source_instance, preview.source_flight_id]);
      if (prior.rows[0]) { const row = prior.rows[0]; if (row.destination_region !== preview.destination_region || row.export_digest !== preview.export_digest) throw new Error("DESTINATION_CONFLICT"); await client.query("COMMIT"); res.json({ operationId: row.operation_id, destinationFlightId: row.destination_flight_id, region: row.destination_region, completedAt: row.completed_at, reused: true }); return; }
      const proposal = await buildProposal(client, preview.verified_export, preview.destination_region);
      if (canonicalJson(proposal) !== canonicalJson(preview.proposal)) throw new Error("DESTINATION_CHANGED");
      const imported = await importPayload(client, preview.verified_export, preview.destination_region, current); const operationId = preview.preview_id;
      await client.query(`INSERT INTO lis.migration_transfers (operation_id,source_instance,source_flight_id,export_id,export_digest,destination_flight_id,destination_region,source_actor_subject,source_actor_issuer,destination_actor_subject,destination_actor_issuer,completed_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())`, [operationId, preview.source_instance, preview.source_flight_id, preview.export_id, preview.export_digest, imported.destinationFlightId, preview.destination_region, preview.verified_export.exportedBy.subject, preview.verified_export.exportedBy.issuer, current.subject, current.issuer]);
      for (const mapping of imported.mappings) await client.query("INSERT INTO lis.migration_entity_mappings (operation_id,entity_type,source_id,destination_id,created) VALUES ($1,$2,$3,$4,$5)", [operationId, mapping.type, mapping.source, mapping.destination, mapping.created]);
      await client.query("COMMIT"); res.status(201).json({ operationId, destinationFlightId: imported.destinationFlightId, region: preview.destination_region, completedAt: new Date().toISOString() });
    } catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; } finally { client.release(); }
  } catch (error) { migrationApiError(res, error); }
});
router.get("/operations/:id", createRequireAdmin("Exact admin role required"), async (req, res) => {
  const configured = config(req); if (!configuredForDestination(configured)) { disabled(res); return; }
  try { const current = await actor(req); const result = await pool.query("SELECT * FROM lis.migration_transfers WHERE operation_id=$1 AND destination_actor_subject=$2 AND destination_actor_issuer=$3", [req.params.id, current.subject, current.issuer]); if (!result.rows[0]) throw new Error("OPERATION_NOT_FOUND"); res.json(result.rows[0]); } catch (error) { migrationApiError(res, error); }
});

// Narrow server-to-server transport. These endpoints never mutate business data.
migrationInternalRouter.get("/exports/:id", async (req, res) => {
  const configured = config(req); if (!configuredForSource(configured) || !hasServiceCredential(req, configured.exportReadCredential)) { res.status(404).end(); return; }
  try { const result = await pool.query<{ payload_canonical: Buffer; digest: string; key_id: string; signature: string }>("SELECT payload_canonical,digest,key_id,signature FROM lis.migration_exports WHERE export_id=$1 AND source_instance=$2 AND expires_at > NOW()", [req.params.id, configured.sourceInstance]); if (!result.rows[0]) throw new Error("EXPORT_NOT_FOUND"); const row = result.rows[0]; res.json({ payload: JSON.parse(row.payload_canonical.toString("utf8")), digest: row.digest, keyId: row.key_id, signature: row.signature }); } catch (error) { migrationApiError(res, error); }
});
migrationInternalRouter.get("/exports/:id/digest", async (req, res) => {
  const configured = config(req); if (!configuredForSource(configured) || !hasServiceCredential(req, configured.exportReadCredential)) { res.status(404).end(); return; }
  try { const result = await pool.query<{ source_flight_id: string }>("SELECT source_flight_id FROM lis.migration_exports WHERE export_id=$1 AND source_instance=$2 AND expires_at > NOW()", [req.params.id, configured.sourceInstance]); if (!result.rows[0]) throw new Error("EXPORT_NOT_FOUND"); res.json({ digest: await currentFlightDigest(pool, result.rows[0].source_flight_id, configured) }); } catch (error) { migrationApiError(res, error); }
});
migrationInternalRouter.get("/status/:instance/:flightId", async (req, res) => {
  const configured = config(req); if (!configuredForDestination(configured) || !hasServiceCredential(req, configured.statusReadCredential) || req.params.instance !== configured.sourceInstance) { res.status(404).end(); return; }
  try { const result = await pool.query("SELECT operation_id,destination_flight_id,destination_region,export_digest,completed_at FROM lis.migration_transfers WHERE source_instance=$1 AND source_flight_id=$2", [req.params.instance, req.params.flightId]); res.json(result.rows[0] || { status: "not_migrated" }); } catch (error) { migrationApiError(res, error); }
});
export default router;
