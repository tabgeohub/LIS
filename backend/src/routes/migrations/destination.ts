import { request } from "undici";
import type { Pool, PoolClient } from "pg";
import { MAX_EXPORT_BYTES, verifyExport, type FlightMigrationExportV1, type Json, type SignedExport } from "../../migrations/exportContract";
import { matchGeometry, matchPoint, type MatchGeometry, type MatchPoint, normalizedName } from "../../migrations/matching";
import { missingRequiredColumns, REQUIRED_COLUMNS, SKIPPED_COLUMNS, type ImportColumn, type ImportSchema } from "../../migrations/schemaPreflight";
import type { MigrationConfig } from "./config";

type Row = Record<string, unknown>;
const q = (name: string) => `"${name.split('"').join('""')}"`;
const obj = (value: Json): Row => value && typeof value === "object" && !Array.isArray(value) ? value as Row : (() => { throw new Error("INVALID_EXPORT"); })();
const id = (row: Row) => String(row.id ?? "");
const name = (row: Row) => String(row.omschrijving ?? "");
const num = (row: Row, key: string) => Number(row[key]);
const shapePoint = (row: Row): MatchPoint => ({ id: id(row), name: name(row), region: String(row.regio_id ?? ""), latitude: num(row, "latitude"), longitude: num(row, "longitude"), rdX: num(row, "xcoordinaat_rd"), rdY: num(row, "ycoordinaat_rd"), geometryId: row.geometry_id == null ? null : String(row.geometry_id) });
const shapeGeometry = (row: Row): MatchGeometry => ({ id: id(row), name: name(row), region: String(row.regio_id ?? ""), type: String(row.type ?? ""), vertices: Array.isArray(row.vertices) ? row.vertices.map(value => shapePoint(obj(value as Json))) : [] });

export function regionNames(rows: Array<{ id: unknown }>, configured: string[]): string[] {
  const actual = new Set(rows.map(row => typeof row.id === "string" ? row.id : "").filter(value => value && value !== "admin"));
  return configured.filter(region => actual.has(region) && region !== "admin");
}
export async function selectableRegions(db: Pick<Pool, "query">, configured: string[]): Promise<string[]> {
  const result = await db.query<{ id: unknown }>("SELECT id FROM lis.regios ORDER BY id");
  return regionNames(result.rows, configured);
}
export async function fetchSourceExport(config: MigrationConfig, exportId: string): Promise<SignedExport> {
  const base = new URL(config.sourceBackendUrl);
  const url = new URL(`/internal/migrations/exports/${encodeURIComponent(exportId)}`, base);
  if (url.origin !== base.origin) throw new Error("SOURCE_URL_REJECTED");
  const response = await request(url, { method: "GET", headers: { authorization: `Bearer ${config.exportReadCredential}`, accept: "application/json" }, headersTimeout: 15000, bodyTimeout: 15000 });
  if (response.statusCode !== 200) throw new Error("SOURCE_EXPORT_UNAVAILABLE");
  const bytes = Buffer.from(await response.body.arrayBuffer());
  if (bytes.length > MAX_EXPORT_BYTES + 1024 * 1024) throw new Error("EXPORT_TOO_LARGE");
  let body: unknown; try { body = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("INVALID_EXPORT"); }
  if (!body || typeof body !== "object" || !("payload" in body) || !("digest" in body) || !("keyId" in body) || !("signature" in body)) throw new Error("INVALID_EXPORT");
  return body as SignedExport;
}
function sourcePoints(payload: FlightMigrationExportV1): Row[] {
  const rows = [...payload.records.points, ...payload.records.geometries.flatMap(geometry => { const record = obj(geometry); return Array.isArray(record.vertices) ? record.vertices as Json[] : []; })].map(value => obj(value));
  return [...new Map(rows.map(row => [id(row), row])).values()];
}
async function schemaColumns(client: Pick<PoolClient, "query">): Promise<ImportColumn[]> {
  const tables = Object.keys(REQUIRED_COLUMNS);
  return (await client.query<any>(`SELECT table_name,column_name,is_nullable,column_default,is_generated,identity_generation,data_type,udt_name FROM information_schema.columns WHERE table_schema='lis' AND table_name = ANY($1::text[])`, [tables])).rows;
}
function compatible(column: ImportColumn | undefined, ...types: string[]): boolean { return Boolean(column && types.includes(column.data_type)); }
function requiredForeignKeys() {
  return new Set(["points.geometry_id", "attachments.point_id", "finished_plans.plan_id", "finished_plans.point_id", "finished_plans_path.planid"]);
}
export async function ensureImportSchema(client: Pick<PoolClient, "query">): Promise<ImportSchema> {
  const columns = await schemaColumns(client);
  const missing = missingRequiredColumns(columns);
  if (missing.length) throw new Error("UNSUPPORTED_SCHEMA_" + missing.join(","));
  const owner = columns.find(c => c.table_name === "flightplans" && c.column_name === "user_id");
  if (!owner || !["text", "character varying", "character"].includes(owner.data_type)) throw new Error("UNSUPPORTED_SCHEMA_FLIGHT_OWNER");
  const pointOwner = columns.find(c => c.table_name === "points" && c.column_name === "user_id");
  if (!pointOwner || !["text", "character varying", "character"].includes(pointOwner.data_type)) throw new Error("UNSUPPORTED_SCHEMA_POINT_OWNER");
  const timestamp = columns.find(c => c.table_name === "finished_plans" && c.column_name === "finished_at");
  if (!timestamp || !["timestamp with time zone", "timestamp without time zone"].includes(timestamp.data_type)) throw new Error("UNSUPPORTED_SCHEMA_FINISHED_AT");
  if (columns.some(c => SKIPPED_COLUMNS.has(c.column_name) && c.is_nullable === "NO" && !c.column_default)) throw new Error("UNSUPPORTED_SCHEMA_SKIPPED_FIELD");
  const requiredPath = columns.find(c => c.table_name === "finished_plans_path" && c.column_name === "planid");
  if (!requiredPath) throw new Error("UNSUPPORTED_SCHEMA_PATH_PLANID");
  if (!compatible(columns.find(c => c.table_name === "flightplans" && c.column_name === "points"), "ARRAY") || !compatible(columns.find(c => c.table_name === "finished_plans" && c.column_name === "attachments_id"), "ARRAY") || !compatible(columns.find(c => c.table_name === "finished_plans_path" && c.column_name === "path"), "jsonb", "json") || !compatible(columns.find(c => c.table_name === "attachments" && c.column_name === "url"), "text", "character varying", "character")) throw new Error("UNSUPPORTED_SCHEMA_REQUIRED_TYPES");
  const refs = await client.query<{ table_name: string; column_name: string }>(`SELECT kcu.table_name,kcu.column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.constraint_schema=kcu.constraint_schema WHERE tc.table_schema='lis' AND tc.constraint_type='FOREIGN KEY' AND kcu.table_name=ANY($1::text[])`, [Object.keys(REQUIRED_COLUMNS)]);
  if (refs.rows.some(row => row.column_name === "user_id" || row.column_name === "userid")) throw new Error("UNSUPPORTED_SCHEMA_HISTORICAL_ACTOR_FK");
  const seenForeignKeys = new Set(refs.rows.map(row => `${row.table_name}.${row.column_name}`));
  for (const foreignKey of requiredForeignKeys()) if (!seenForeignKeys.has(foreignKey)) throw new Error(`UNSUPPORTED_SCHEMA_MISSING_FOREIGN_KEY_${foreignKey}`);
  const tables = Object.keys(REQUIRED_COLUMNS);
  const [triggers, rls] = await Promise.all([
    client.query<{ table_name: string }>(`SELECT c.relname AS table_name FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='lis' AND c.relname=ANY($1::text[]) AND t.tgenabled <> 'D' AND NOT t.tgisinternal`, [tables]),
    client.query<{ table_name: string }>(`SELECT c.relname AS table_name FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='lis' AND c.relname=ANY($1::text[]) AND c.relrowsecurity`, [tables]),
  ]);
  if (triggers.rows.length) throw new Error(`UNSUPPORTED_SCHEMA_TRIGGER_${triggers.rows.map(row => row.table_name).join(",")}`);
  if (rls.rows.length) throw new Error(`UNSUPPORTED_SCHEMA_ROW_SECURITY_${rls.rows.map(row => row.table_name).join(",")}`);
  const writable = new Map<string, string[]>(), required = new Map<string, string[]>();
  for (const table of Object.keys(REQUIRED_COLUMNS)) {
    const fields = columns.filter(c => c.table_name === table && c.column_name !== "id" && c.is_generated !== "ALWAYS" && c.identity_generation !== "ALWAYS").map(c => c.column_name);
    if (["flightplans", "points", "geometries", "attachments"].includes(table) && !columns.some(c => c.table_name === table && c.column_name === "id" && (c.column_default || c.identity_generation))) throw new Error(`UNSUPPORTED_SCHEMA_${table}_ID_GENERATION`);
    writable.set(table, fields);
    required.set(table, columns.filter(c => c.table_name === table && c.column_name !== "id" && c.is_generated !== "ALWAYS" && c.identity_generation !== "ALWAYS" && c.is_nullable === "NO" && !c.column_default).map(c => c.column_name));
  }
  return { writable, required };
}
function projection(table: string, source: Row, columns: string[], remove: string[], additions: Row): Row {
  const dropped = new Set(["id", ...remove]); const result: Row = {};
  for (const key of Object.keys(source)) if (!columns.includes(key) && !dropped.has(key)) throw new Error(`UNSUPPORTED_SCHEMA_${table}_COLUMN_${key}`);
  for (const column of columns) if (!dropped.has(column) && source[column] !== undefined) result[column] = source[column];
  for (const [key, value] of Object.entries(additions)) if (columns.includes(key)) result[key] = value;
  return result;
}
async function insertJson(client: Pick<PoolClient, "query">, schema: ImportSchema, table: string, value: Row): Promise<Row> {
  const columns = schema.writable.get(table) || [];
  const missing = (schema.required.get(table) || []).filter(column => value[column] === undefined);
  if (missing.length) throw new Error(`UNSUPPORTED_SCHEMA_${table}_REQUIRED_${missing.join(",")}`);
  const active = columns.filter(column => value[column] !== undefined);
  if (!active.length) throw new Error(`UNSUPPORTED_SCHEMA_${table}_NO_COLUMNS`);
  const list = active.map(q).join(", ");
  const select = active.map(column => `r.${q(column)}`).join(", ");
  const result = await client.query<Row>(`INSERT INTO lis.${q(table)} (${list}) SELECT ${select} FROM jsonb_populate_record(NULL::lis.${q(table)}, $1::jsonb) r RETURNING *`, [JSON.stringify(value)]);
  if (!result.rows[0]) throw new Error("IMPORT_INSERT_FAILED"); return result.rows[0];
}
async function loadDestinations(client: Pick<PoolClient, "query">, payload: FlightMigrationExportV1) {
  const points = sourcePoints(payload); const pointNames = [...new Set(points.map(name).filter(Boolean))];
  const geometryNames = [...new Set(payload.records.geometries.map(value => name(obj(value))).filter(Boolean))];
  const destinationPoints = pointNames.length ? (await client.query<Row>("SELECT * FROM lis.points", [])).rows : [];
  const destinationGeometries = geometryNames.length ? (await client.query<Row>(`SELECT to_jsonb(g) || jsonb_build_object('vertices', COALESCE(v.rows, '[]'::jsonb)) AS row FROM lis.geometries g LEFT JOIN LATERAL (SELECT jsonb_agg(to_jsonb(p) ORDER BY p.id) AS rows FROM lis.points p WHERE p.geometry_id=g.id) v ON true`, [])).rows.map(row => obj(row.row as Json)) : [];
  return { destinationPoints, destinationGeometries };
}
export async function buildProposal(client: Pick<PoolClient, "query">, payload: FlightMigrationExportV1, region: string): Promise<Json> {
  await ensureImportSchema(client);
  const { destinationPoints, destinationGeometries } = await loadDestinations(client, payload);
  const points = sourcePoints(payload); const geometries = payload.records.geometries.map(value => obj(value));
  const conflicts: string[] = [];
  const pointMappings = points.map(source => { const result = matchPoint(shapePoint(source), destinationPoints.map(shapePoint), region); if (result.kind === "conflict") conflicts.push(`${name(source)}: ${result.reason}`); return { sourceId: id(source), action: result.kind, destinationId: result.kind === "reuse" ? result.value.id : null }; });
  const geometryMappings = geometries.map(source => { const result = matchGeometry(shapeGeometry(source), destinationGeometries.map(shapeGeometry), region); if (result.kind === "conflict") conflicts.push(`${name(source)}: ${result.reason}`); return { sourceId: id(source), action: result.kind, destinationId: result.kind === "reuse" ? result.value.id : null }; });
  for (const source of points) {
    if (source.geometry_id == null) continue;
    const point = pointMappings.find(mapping => mapping.sourceId === id(source));
    const geometry = geometryMappings.find(mapping => mapping.sourceId === String(source.geometry_id));
    if (!geometry) { conflicts.push(`${name(source)}: missing geometry definition`); continue; }
    if (point?.action === "reuse" && (geometry.action !== "reuse" || !destinationPoints.some(candidate => id(candidate) === point.destinationId && String(candidate.geometry_id) === geometry.destinationId))) conflicts.push(`${name(source)}: point belongs to a different geometry`);
  }
  return { ready: conflicts.length === 0, conflicts, mappings: { points: pointMappings, geometries: geometryMappings }, counts: { points: points.length, geometries: geometries.length, completions: payload.records.completions.length, attachments: payload.records.attachments.length, logs: payload.records.logs.length, hasPath: payload.records.path !== null } } as unknown as Json;
}
export type PhotoHead = (url: URL) => Promise<number>;
async function defaultPhotoHead(url: URL): Promise<number> {
  const response = await request(url, { method: "HEAD", headersTimeout: 10000, bodyTimeout: 10000 });
  response.body.resume();
  return response.statusCode;
}
export async function verifyPhotoReferences(payload: FlightMigrationExportV1, allowedOrigins: string[], head: PhotoHead = defaultPhotoHead): Promise<boolean> {
  for (const value of payload.records.attachments) {
    const attachment = obj(value); const raw = attachment.url;
    if (typeof raw !== "string") return false;
    let url: URL; try { url = new URL(raw); } catch { return false; }
    if (!allowedOrigins.includes(url.origin)) return false;
    const status = await head(url); if (status < 200 || status >= 300) return false;
  }
  return true;
}
function field(row: Row, ...keys: string[]): unknown { for (const key of keys) if (row[key] !== undefined) return row[key]; return undefined; }
function mappedId(map: Map<string, string>, value: unknown, what: string): string { const target = map.get(String(value)); if (!target) throw new Error(`MISSING_${what}_MAPPING`); return target; }
export async function importPayload(client: PoolClient, payload: FlightMigrationExportV1, region: string, actor: { subject: string }): Promise<{ destinationFlightId: string; mappings: Array<{ type: string; source: string; destination: string; created: boolean }> }> {
  const schema = await ensureImportSchema(client); await client.query("SELECT pg_advisory_xact_lock(hashtext('lis.migration.import'))"); await client.query("LOCK TABLE lis.geometries, lis.points, lis.flightplans, lis.finished_plans, lis.attachments, lis.finished_plans_path, lis.logging IN SHARE ROW EXCLUSIVE MODE");
  const proposal = await buildProposal(client, payload, region); if (obj(proposal).ready !== true) throw new Error("MATCHING_CONFLICT");
  const mappings: Array<{ type: string; source: string; destination: string; created: boolean }> = [];
  const { destinationPoints, destinationGeometries } = await loadDestinations(client, payload);
  const geometryMap = new Map<string, string>();
  for (const source of payload.records.geometries.map(value => obj(value))) {
    const match = matchGeometry(shapeGeometry(source), destinationGeometries.map(shapeGeometry), region);
    if (match.kind === "reuse") { geometryMap.set(id(source), match.value.id); mappings.push({ type: "geometry", source: id(source), destination: match.value.id, created: false }); }
    else { const created = await insertJson(client, schema, "geometries", projection("geometries", source, schema.writable.get("geometries")!, ["vertices", "regio_id", "organisatie", "organisatie_id", "activiteit", "activiteit_id", "copied_from"], { regio_id: region })); geometryMap.set(id(source), id(created)); mappings.push({ type: "geometry", source: id(source), destination: id(created), created: true }); }
  }
  const pointMap = new Map<string, string>();
  for (const source of sourcePoints(payload)) {
    const match = matchPoint(shapePoint(source), destinationPoints.map(shapePoint), region);
    if (match.kind === "reuse") { pointMap.set(id(source), match.value.id); mappings.push({ type: "point", source: id(source), destination: match.value.id, created: false }); }
    else { const geometry = field(source, "geometry_id"); const created = await insertJson(client, schema, "points", projection("points", source, schema.writable.get("points")!, ["regio_id", "user_id", "organisatie_id", "activiteit_id", "copied_from"], { regio_id: region, user_id: actor.subject, ...(geometry == null ? {} : { geometry_id: mappedId(geometryMap, geometry, "GEOMETRY") }) })); pointMap.set(id(source), id(created)); mappings.push({ type: "point", source: id(source), destination: id(created), created: true }); }
  }
  const sourceFlight = obj(payload.records.flight); const sourceMembers = Array.isArray(sourceFlight.points) ? sourceFlight.points : [];
  const flight = await insertJson(client, schema, "flightplans", projection("flightplans", sourceFlight, schema.writable.get("flightplans")!, ["regio_id", "user_id", "points", "status", "copied_from", "activiteiten", "organisatie", "piloot", "waarnemer", "luchtvaartuig"], { regio_id: region, user_id: actor.subject, status: "finished", points: sourceMembers.map(sourceId => Number(mappedId(pointMap, sourceId, "POINT")) ) }));
  const destinationFlightId = id(flight); mappings.push({ type: "flight", source: id(sourceFlight), destination: destinationFlightId, created: true });
  const attachmentMap = new Map<string, string>();
  for (const value of payload.records.attachments) { const source = obj(value); const created = await insertJson(client, schema, "attachments", projection("attachments", source, schema.writable.get("attachments")!, ["point_id"], { point_id: mappedId(pointMap, field(source, "point_id"), "POINT") })); attachmentMap.set(id(source), id(created)); mappings.push({ type: "attachment", source: id(source), destination: id(created), created: true }); }
  for (const value of payload.records.completions) { const source = obj(value); const attachments = Array.isArray(source.attachments_id) ? source.attachments_id.map(value => Number(mappedId(attachmentMap, value, "ATTACHMENT"))) : []; await insertJson(client, schema, "finished_plans", projection("finished_plans", source, schema.writable.get("finished_plans")!, ["plan_id", "point_id", "attachments_id"], { plan_id: Number(destinationFlightId), point_id: Number(mappedId(pointMap, field(source, "point_id"), "POINT")), attachments_id: attachments })); }
  if (payload.records.path) { const source = obj(payload.records.path); await insertJson(client, schema, "finished_plans_path", projection("finished_plans_path", source, schema.writable.get("finished_plans_path")!, ["planid", "plan_id"], { planid: Number(destinationFlightId) })); }
  if (payload.records.logs.length) {
    await client.query("SELECT pg_advisory_xact_lock(hashtext('lis.logging.flight_id'))");
    let nextGroup = Number((await client.query<{ flight_id: number }>("SELECT COALESCE(MAX(flight_id),0)+1 AS flight_id FROM lis.logging")).rows[0].flight_id);
    const logColumns = schema.writable.get("logging")!;
    const planColumn = logColumns.includes("planid") ? "planid" : "planId";
    const pointColumn = logColumns.includes("pointid") ? "pointid" : "pointId";
    const groupMap = new Map<string, number>();
    for (const value of payload.records.logs) {
      const source = obj(value); const sourceGroup = String(field(source, "flight_id"));
      if (!sourceGroup || sourceGroup === "undefined") throw new Error("INVALID_EXPORT_LOG_GROUP");
      if (!groupMap.has(sourceGroup)) groupMap.set(sourceGroup, nextGroup++);
      const sourcePlan = field(source, "planid", "planId"); const sourcePoint = field(source, "pointid", "pointId");
      await insertJson(client, schema, "logging", projection("logging", source, logColumns, ["flight_id", "planid", "planId", "pointid", "pointId"], { flight_id: groupMap.get(sourceGroup), ...(sourcePlan == null ? {} : { [planColumn]: Number(destinationFlightId) }), ...(sourcePoint == null ? {} : { [pointColumn]: Number(mappedId(pointMap, sourcePoint, "POINT")) }) }));
    }
    for (const [source, destination] of groupMap) mappings.push({ type: "log_group", source, destination: String(destination), created: true });
  }
  return { destinationFlightId, mappings };
}
export { verifyExport };
