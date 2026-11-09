import { createHash, randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { canonicalJson, type FlightMigrationExportV1, type Json, signExport, type SignedExport } from "../../migrations/exportContract";
import type { MigrationConfig } from "./config";

function rowsJson(rows: Array<{ row: Json }>): Json[] { return rows.map(row => row.row); }
function asObject(value: Json): Record<string, Json> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_EXPORT"); return value; }
const OMITTED_LOOKUPS = new Set(["copied_from", "organisatie", "organisatie_id", "activiteit", "activiteit_id", "activiteiten", "piloot", "waarnemer", "luchtvaartuig"]);
const PROHIBITED = /(?:password|secret|access_token|refresh_token|provider_token|permit|recovery_context|cookie)/i;

/** The migration never needs source lookup IDs or credentials.  Removing them
 * before signing makes the persisted export safe to retrieve through the
 * restricted transport endpoint. */
function exportRow(value: Json, preserveActor = false): Json {
  const row = asObject(value);
  const clean: Record<string, Json> = {};
  for (const [key, child] of Object.entries(row)) {
    if (PROHIBITED.test(key) || (!preserveActor && OMITTED_LOOKUPS.has(key))) continue;
    clean[key] = Array.isArray(child) ? child.map(item => exportRowValue(item, preserveActor)) : exportRowValue(child, preserveActor);
  }
  return clean;
}
function exportRowValue(value: Json, preserveActor: boolean): Json {
  if (value && typeof value === "object" && !Array.isArray(value)) return exportRow(value, preserveActor);
  return value;
}

/** Captures raw persistence rows in one read-only repeatable-read snapshot. */
export async function captureFlightSnapshot(db: Pick<Pool, "connect">, flightId: string, actor: { subject: string; issuer: string }, config: MigrationConfig, now = Date.now()): Promise<SignedExport> {
  const client = await db.connect();
  try {
    await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const flight = await client.query<{ row: Json }>("SELECT to_jsonb(fp) AS row FROM lis.flightplans fp WHERE fp.id = $1 AND fp.status = 'finished'", [flightId]);
    if (!flight.rows[0]) throw new Error("FLIGHT_NOT_FINISHED");
    const points = await client.query<{ row: Json }>(`SELECT to_jsonb(p) AS row
      FROM lis.points p JOIN lis.flightplans fp ON fp.id = $1
      WHERE p.id = ANY(fp.points) OR p.geometry_id IN (
        SELECT DISTINCT member.geometry_id FROM lis.points member WHERE member.id = ANY(fp.points) AND member.geometry_id IS NOT NULL
      )
      ORDER BY CASE WHEN p.id = ANY(fp.points) THEN 0 ELSE 1 END, array_position(fp.points, p.id) NULLS LAST, p.id`, [flightId]);
    const geometries = await client.query<{ row: Json }>(`
      SELECT to_jsonb(g) || jsonb_build_object('vertices', COALESCE(vertices.rows, '[]'::jsonb)) AS row
      FROM lis.geometries g
      JOIN (SELECT DISTINCT (to_jsonb(p)->>'geometry_id')::bigint AS id FROM lis.points p JOIN lis.flightplans fp ON p.id = ANY(fp.points) WHERE fp.id = $1) refs ON refs.id = g.id
      LEFT JOIN LATERAL (SELECT jsonb_agg(to_jsonb(p) ORDER BY p.id) AS rows FROM lis.points p WHERE p.geometry_id = g.id) vertices ON true
      ORDER BY g.id`, [flightId]);
    const completions = await client.query<{ row: Json }>("SELECT to_jsonb(f) AS row FROM lis.finished_plans f WHERE f.plan_id = $1 ORDER BY f.point_order, f.point_id", [flightId]);
    const attachments = await client.query<{ row: Json }>(`
      SELECT row FROM (SELECT DISTINCT a.id, to_jsonb(a) AS row FROM lis.finished_plans f
      CROSS JOIN LATERAL unnest(COALESCE(f.attachments_id, ARRAY[]::integer[])) AS refs(att_id)
      JOIN lis.attachments a ON a.id = refs.att_id WHERE f.plan_id = $1) attachment_rows ORDER BY id`, [flightId]);
    const path = await client.query<{ row: Json }>("SELECT to_jsonb(p) AS row FROM lis.finished_plans_path p WHERE p.planid = $1 ORDER BY p.planid", [flightId]);
    const logs = await client.query<{ row: Json }>("SELECT to_jsonb(l) AS row FROM lis.logging l WHERE COALESCE(to_jsonb(l)->>'planid', to_jsonb(l)->>'planId') = $1 ORDER BY l.flight_id, l.id", [flightId]);
    const records = { flight: exportRow(flight.rows[0].row), points: rowsJson(points.rows).map(row => exportRow(row)), geometries: rowsJson(geometries.rows).map(row => exportRow(row)), completions: rowsJson(completions.rows).map(row => exportRow(row)), attachments: rowsJson(attachments.rows).map(row => exportRow(row)), path: path.rows[0] ? exportRow(path.rows[0].row) : null, logs: rowsJson(logs.rows).map(row => exportRow(row, true)) };
    const memberIds = asObject(records.flight).points;
    if (!Array.isArray(memberIds) || new Set(memberIds.map(String)).size !== memberIds.length || records.completions.length === 0 || path.rows.length > 1) throw new Error("INVALID_EXPORT_STRUCTURE");
    const pointIds = new Set(records.points.map(row => String(asObject(row).id)));
    const completionIds = records.completions.map(row => String(asObject(row).point_id));
    if (memberIds.some(member => !pointIds.has(String(member))) || completionIds.some(pointId => !pointIds.has(pointId)) || new Set(completionIds).size !== completionIds.length || completionIds.length !== memberIds.length || memberIds.some(member => !completionIds.includes(String(member)))) throw new Error("INVALID_EXPORT_STRUCTURE");
    const geometryIds = new Set(records.geometries.map(row => String(asObject(row).id)));
    const vertices = records.geometries.flatMap(row => Array.isArray(asObject(row).vertices) ? asObject(row).vertices : []);
    if (records.points.some(row => { const geometry = asObject(row).geometry_id; return geometry != null && !geometryIds.has(String(geometry)); }) || vertices.some(vertex => !pointIds.has(String(asObject(vertex).id)))) throw new Error("INVALID_EXPORT_STRUCTURE");
    const attachmentIds = new Set(records.attachments.map(row => String(asObject(row).id)));
    if (records.completions.some(row => { const ids = asObject(row).attachments_id; return ids != null && (!Array.isArray(ids) || ids.some(value => !attachmentIds.has(String(value)))); })) throw new Error("INVALID_EXPORT_STRUCTURE");
    const payload: FlightMigrationExportV1 = {
      version: 1, source: { instance: config.sourceInstance, environment: config.sourceEnvironment, issuer: actor.issuer, flightId }, exportId: randomUUID(),
      createdAt: new Date(now).toISOString(), expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(), exportedBy: { subject: actor.subject, issuer: actor.issuer },
      records, counts: { points: records.points.length, geometries: records.geometries.length, completions: records.completions.length, attachments: records.attachments.length, logs: records.logs.length },
    };
    // Canonicalize before signing so accidental non-JSON database values fail here.
    canonicalJson(payload as unknown as Json); asObject(records.flight);
    const signed = signExport(payload, config.exportKeyId, config.exportPrivateKey, now);
    await client.query("COMMIT");
    return signed;
  } catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; } finally { client.release(); }
}

/** Stable digest of saved business records, excluding export ID, actor and expiry. */
export async function currentFlightDigest(db: Pick<Pool, "connect">, flightId: string, config: MigrationConfig): Promise<string> {
  const snapshot = await captureFlightSnapshot(db, flightId, { subject: "digest-check", issuer: "digest-check" }, config);
  return createHash("sha256").update(canonicalJson(snapshot.payload.records as unknown as Json)).digest("hex");
}
