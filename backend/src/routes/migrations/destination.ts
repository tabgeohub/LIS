import { request } from "undici";
import type { Pool, PoolClient } from "pg";
import { type FlightMigrationExportV1, type Json } from "../../migrations/exportContract";
import { matchGeometry, matchPoint, type MatchGeometry, type MatchPoint } from "../../migrations/matching";
import { FinishedAtSchemaError, missingRequiredColumns, REQUIRED_COLUMNS, SKIPPED_COLUMNS, type ImportColumn, type ImportSchema } from "../../migrations/schemaPreflight";

type Row = Record<string, unknown>;
const q = (name: string) => `"${name.split('"').join('""')}"`;
const obj = (value: Json): Row => value && typeof value === "object" && !Array.isArray(value) ? value as Row : (() => { throw new Error("INVALID_EXPORT"); })();
const id = (row: Row) => String(row.id ?? "");
const name = (row: Row) => String(row.omschrijving ?? "");
const num = (row: Row, key: string) => Number(row[key]);
const shapePoint = (row: Row): MatchPoint => ({ id: id(row), name: name(row), region: String(row.regio_id ?? ""), latitude: num(row, "latitude"), longitude: num(row, "longitude"), rdX: num(row, "xcoordinaat_rd"), rdY: num(row, "ycoordinaat_rd"), geometryId: row.geometry_id == null ? null : String(row.geometry_id) });
const shapeGeometry = (row: Row): MatchGeometry => ({ id: id(row), name: name(row), region: String(row.regio_id ?? ""), type: String(row.type ?? ""), vertices: Array.isArray(row.vertices) ? row.vertices.map(value => shapePoint(obj(value as Json))) : [] });

export async function selectableRegions(db: Pick<Pool, "query">, roles: string[]): Promise<string[]> {
  const actual = new Set((await db.query<{ id: unknown }>("SELECT id FROM lis.regios ORDER BY id")).rows.map(row => typeof row.id === "string" ? row.id : ""));
  return roles.filter(role => role !== "admin" && actual.has(role));
}
function sourcePoints(payload: FlightMigrationExportV1): Row[] {
  const rows = [...payload.records.points, ...payload.records.geometries.flatMap(geometry => { const record = obj(geometry); return Array.isArray(record.vertices) ? record.vertices as Json[] : []; })].map(value => obj(value));
  return [...new Map(rows.map(row => [id(row), row])).values()];
}
async function schemaColumns(client: Pick<PoolClient, "query">): Promise<ImportColumn[]> {
  return (await client.query<any>("SELECT table_name,column_name,is_nullable,column_default,is_generated,identity_generation,data_type,udt_name FROM information_schema.columns WHERE table_schema='lis' AND table_name = ANY($1::text[])", [Object.keys(REQUIRED_COLUMNS)])).rows;
}
function compatible(column: ImportColumn | undefined, ...types: string[]): boolean { return Boolean(column && types.includes(column.data_type)); }
const REQUIRED_FOREIGN_KEYS = new Set(["points.geometry_id", "attachments.point_id", "finished_plans.plan_id", "finished_plans.point_id", "finished_plans_path.planid"]);
export async function ensureImportSchema(client: Pick<PoolClient, "query">): Promise<ImportSchema> {
  const columns = await schemaColumns(client);
  const finishedAt = columns.find(column => column.table_name === "finished_plans" && column.column_name === "finished_at");
  if (!compatible(finishedAt, "timestamp with time zone", "timestamp without time zone")) throw new FinishedAtSchemaError(finishedAt);
  const missing = missingRequiredColumns(columns); if (missing.length) throw new Error("UNSUPPORTED_SCHEMA_" + missing.join(","));
  const owner = columns.find(column => column.table_name === "flightplans" && column.column_name === "user_id");
  const pointOwner = columns.find(column => column.table_name === "points" && column.column_name === "user_id");
  if (!owner || !["text", "character varying", "character"].includes(owner.data_type)) throw new Error("UNSUPPORTED_SCHEMA_FLIGHT_OWNER");
  if (!pointOwner || !["text", "character varying", "character"].includes(pointOwner.data_type)) throw new Error("UNSUPPORTED_SCHEMA_POINT_OWNER");
  for (const table of ["flightplans", "points", "geometries", "attachments"] as const) {
    const key = columns.find(column => column.table_name === table && column.column_name === "id");
    if (!compatible(key, "integer", "bigint", "smallint")) throw new Error(`UNSUPPORTED_SCHEMA_${table}_ID_TYPE`);
  }
  if (!columns.some(column => column.table_name === "finished_plans_path" && column.column_name === "planid")) throw new Error("UNSUPPORTED_SCHEMA_PATH_PLANID");
  if (!compatible(columns.find(column => column.table_name === "flightplans" && column.column_name === "points"), "ARRAY") || !compatible(columns.find(column => column.table_name === "finished_plans" && column.column_name === "attachments_id"), "ARRAY") || !compatible(columns.find(column => column.table_name === "finished_plans_path" && column.column_name === "path"), "jsonb", "json") || !compatible(columns.find(column => column.table_name === "attachments" && column.column_name === "url"), "text", "character varying", "character")) throw new Error("UNSUPPORTED_SCHEMA_REQUIRED_TYPES");
  if (columns.some(column => SKIPPED_COLUMNS.has(column.column_name) && column.is_nullable === "NO" && !column.column_default)) throw new Error("UNSUPPORTED_SCHEMA_SKIPPED_FIELD");
  const tables = Object.keys(REQUIRED_COLUMNS);
  const [foreignKeys, constraints, triggers, rls] = await Promise.all([
    client.query<{ table_name: string; column_name: string }>("SELECT kcu.table_name,kcu.column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.constraint_schema=kcu.constraint_schema WHERE tc.table_schema='lis' AND tc.constraint_type='FOREIGN KEY' AND kcu.table_name=ANY($1::text[])", [tables]),
    client.query<{ table_name: string; constraint_type: string; columns: string[] }>("SELECT c.relname AS table_name, con.contype AS constraint_type, array_agg(a.attname ORDER BY keys.ordinality) AS columns FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN unnest(con.conkey) WITH ORDINALITY keys(attnum, ordinality) ON true LEFT JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=keys.attnum WHERE n.nspname='lis' AND c.relname=ANY($1::text[]) GROUP BY c.relname,con.conname,con.contype", [tables]),
    client.query<{ table_name: string }>("SELECT c.relname AS table_name FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='lis' AND c.relname=ANY($1::text[]) AND t.tgenabled <> 'D' AND NOT t.tgisinternal", [tables]),
    client.query<{ table_name: string }>("SELECT c.relname AS table_name FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='lis' AND c.relname=ANY($1::text[]) AND c.relrowsecurity", [tables]),
  ]);
  if (foreignKeys.rows.some(row => row.column_name === "user_id" || row.column_name === "userid")) throw new Error("UNSUPPORTED_SCHEMA_HISTORICAL_ACTOR_FK");
  const presentForeignKeys = new Set(foreignKeys.rows.map(row => `${row.table_name}.${row.column_name}`));
  for (const foreignKey of REQUIRED_FOREIGN_KEYS) if (!presentForeignKeys.has(foreignKey)) throw new Error(`UNSUPPORTED_SCHEMA_MISSING_FOREIGN_KEY_${foreignKey}`);
  if (constraints.rows.some(row => row.constraint_type === "c" || row.constraint_type === "x" || row.constraint_type === "u" && !(row.columns.length === 1 && row.columns[0] === "id"))) throw new Error("UNSUPPORTED_SCHEMA_CONSTRAINT");
  if (triggers.rows.length) throw new Error("UNSUPPORTED_SCHEMA_TRIGGER_" + triggers.rows.map(row => row.table_name).join(","));
  if (rls.rows.length) throw new Error("UNSUPPORTED_SCHEMA_ROW_SECURITY_" + rls.rows.map(row => row.table_name).join(","));
  const writable = new Map<string, string[]>(), required = new Map<string, string[]>();
  for (const table of tables) {
    if (["flightplans", "points", "geometries", "attachments"].includes(table) && !columns.some(column => column.table_name === table && column.column_name === "id" && (column.column_default || column.identity_generation))) throw new Error(`UNSUPPORTED_SCHEMA_${table}_ID_GENERATION`);
    const fields = columns.filter(column => column.table_name === table && column.column_name !== "id" && column.is_generated !== "ALWAYS" && column.identity_generation !== "ALWAYS");
    writable.set(table, fields.map(column => column.column_name));
    required.set(table, fields.filter(column => column.is_nullable === "NO" && !column.column_default).map(column => column.column_name));
  }
  return { writable, required };
}
function projection(table: string, source: Row, columns: string[], remove: string[], additions: Row): Row {
  const dropped = new Set(["id", ...remove]), result: Row = {};
  for (const key of Object.keys(source)) if (!columns.includes(key) && !dropped.has(key)) throw new Error(`UNSUPPORTED_SCHEMA_${table}_COLUMN_${key}`);
  for (const column of columns) if (!dropped.has(column) && source[column] !== undefined) result[column] = source[column];
  for (const [key, value] of Object.entries(additions)) if (columns.includes(key)) result[key] = value;
  return result;
}
async function insertJson(client: Pick<PoolClient, "query">, schema: ImportSchema, table: string, value: Row): Promise<Row> {
  const columns = schema.writable.get(table) || [];
  const missing = (schema.required.get(table) || []).filter(column => value[column] === undefined); if (missing.length) throw new Error(`UNSUPPORTED_SCHEMA_${table}_REQUIRED_${missing.join(",")}`);
  const active = columns.filter(column => value[column] !== undefined); if (!active.length) throw new Error(`UNSUPPORTED_SCHEMA_${table}_NO_COLUMNS`);
  const result = await client.query<Row>(`INSERT INTO lis.${q(table)} (${active.map(q).join(", ")}) SELECT ${active.map(column => `r.${q(column)}`).join(", ")} FROM jsonb_populate_record(NULL::lis.${q(table)}, $1::jsonb) r RETURNING *`, [JSON.stringify(value)]);
  if (!result.rows[0]) throw new Error("IMPORT_INSERT_FAILED"); return result.rows[0];
}
async function loadDestinations(client: Pick<PoolClient, "query">, payload: FlightMigrationExportV1) {
  const pointNames = [...new Set(sourcePoints(payload).map(name).filter(Boolean))];
  const geometryNames = [...new Set(payload.records.geometries.map(value => name(obj(value))).filter(Boolean))];
  const destinationPoints = pointNames.length ? (await client.query<Row>("SELECT * FROM lis.points")).rows : [];
  const destinationGeometries = geometryNames.length ? (await client.query<Row>("SELECT to_jsonb(g) || jsonb_build_object('vertices', COALESCE(v.rows, '[]'::jsonb)) AS row FROM lis.geometries g LEFT JOIN LATERAL (SELECT jsonb_agg(to_jsonb(p) ORDER BY p.id) AS rows FROM lis.points p WHERE p.geometry_id=g.id) v ON true")).rows.map(row => obj(row.row as Json)) : [];
  return { destinationPoints, destinationGeometries };
}
export async function buildProposal(client: Pick<PoolClient, "query">, payload: FlightMigrationExportV1, region: string): Promise<Json> {
  await ensureImportSchema(client);
  const { destinationPoints, destinationGeometries } = await loadDestinations(client, payload), points = sourcePoints(payload), geometries = payload.records.geometries.map(value => obj(value));
  const conflicts: string[] = [];
  const pointMappings = points.map(source => { const match = matchPoint(shapePoint(source), destinationPoints.map(shapePoint), region); if (match.kind === "conflict") conflicts.push(`${name(source)}: ${match.reason}`); return { sourceId: id(source), action: match.kind, destinationId: match.kind === "reuse" ? match.value.id : null }; });
  const geometryMappings = geometries.map(source => { const match = matchGeometry(shapeGeometry(source), destinationGeometries.map(shapeGeometry), region); if (match.kind === "conflict") conflicts.push(`${name(source)}: ${match.reason}`); return { sourceId: id(source), action: match.kind, destinationId: match.kind === "reuse" ? match.value.id : null }; });
  for (const source of points) { if (source.geometry_id == null) continue; const point = pointMappings.find(mapping => mapping.sourceId === id(source)); const geometry = geometryMappings.find(mapping => mapping.sourceId === String(source.geometry_id)); if (!geometry) { conflicts.push(`${name(source)}: missing geometry definition`); continue; } if (point?.action === "reuse" && (geometry.action !== "reuse" || !destinationPoints.some(candidate => id(candidate) === point.destinationId && String(candidate.geometry_id) === geometry.destinationId))) conflicts.push(`${name(source)}: point belongs to a different geometry`); }
  return { ready: conflicts.length === 0, conflicts, mappings: { points: pointMappings, geometries: geometryMappings }, counts: { points: points.length, geometries: geometries.length, completions: payload.records.completions.length, attachments: payload.records.attachments.length, sourceLogsSkipped: payload.records.logs.length, hasPath: payload.records.path !== null } } as unknown as Json;
}
export type PhotoHead = (url: URL) => Promise<number>;
async function defaultPhotoHead(url: URL): Promise<number> {
  const response = await request(url, { method: "HEAD", headersTimeout: 10000, bodyTimeout: 10000 });
  response.body.resume();
  return response.statusCode;
}
export async function verifyPhotoReferences(payload: FlightMigrationExportV1, allowedOrigins: string[], head: PhotoHead = defaultPhotoHead): Promise<boolean> {
  for (const value of payload.records.attachments) { const attachment = obj(value); if (typeof attachment.url !== "string" || (typeof attachment.attachmentid !== "string" && typeof attachment.attachmentid !== "number") || attachment.attachmentid === "") return false; let url: URL; try { url = new URL(attachment.url); } catch { return false; } if (!allowedOrigins.includes(url.origin) || !/\/FeatureServer\/\d+\/\d+\/attachments\//i.test(url.pathname)) return false; const status = await head(url); if (status < 200 || status >= 300) return false; }
  return true;
}
const field = (row: Row, ...keys: string[]): unknown => keys.map(key => row[key]).find(value => value !== undefined);
const mappedId = (map: Map<string, string>, value: unknown, what: string): string => { const destination = map.get(String(value)); if (!destination) throw new Error(`MISSING_${what}_MAPPING`); return destination; };
export async function importPayload(client: PoolClient, payload: FlightMigrationExportV1, region: string, actor: { subject: string }): Promise<{ destinationFlightId: string; mappings: Array<{ type: string; source: string; destination: string; created: boolean }> }> {
  const schema = await ensureImportSchema(client); await client.query("SELECT pg_advisory_xact_lock(hashtext('lis.migration.import'))"); await client.query("LOCK TABLE lis.geometries, lis.points, lis.flightplans, lis.finished_plans, lis.attachments, lis.finished_plans_path IN SHARE ROW EXCLUSIVE MODE");
  const proposal = await buildProposal(client, payload, region); if (obj(proposal).ready !== true) throw new Error("MATCHING_CONFLICT");
  const mappings: Array<{ type: string; source: string; destination: string; created: boolean }> = [];
  const { destinationPoints, destinationGeometries } = await loadDestinations(client, payload);
  const geometryMap = new Map<string, string>();
  for (const source of payload.records.geometries.map(value => obj(value))) { const match = matchGeometry(shapeGeometry(source), destinationGeometries.map(shapeGeometry), region); if (match.kind === "reuse") { geometryMap.set(id(source), match.value.id); mappings.push({ type: "geometry", source: id(source), destination: match.value.id, created: false }); } else { const created = await insertJson(client, schema, "geometries", projection("geometries", source, schema.writable.get("geometries")!, ["vertices", "regio_id", ...SKIPPED_COLUMNS], { regio_id: region })); geometryMap.set(id(source), id(created)); mappings.push({ type: "geometry", source: id(source), destination: id(created), created: true }); } }
  const pointMap = new Map<string, string>();
  for (const source of sourcePoints(payload)) { const match = matchPoint(shapePoint(source), destinationPoints.map(shapePoint), region); if (match.kind === "reuse") { pointMap.set(id(source), match.value.id); mappings.push({ type: "point", source: id(source), destination: match.value.id, created: false }); } else { const geometry = field(source, "geometry_id"); const created = await insertJson(client, schema, "points", projection("points", source, schema.writable.get("points")!, ["regio_id", "user_id", ...SKIPPED_COLUMNS], { regio_id: region, user_id: actor.subject, ...(geometry == null ? {} : { geometry_id: mappedId(geometryMap, geometry, "GEOMETRY") }) })); pointMap.set(id(source), id(created)); mappings.push({ type: "point", source: id(source), destination: id(created), created: true }); } }
  const sourceFlight = obj(payload.records.flight), sourceMembers = Array.isArray(sourceFlight.points) ? sourceFlight.points : [];
  const flight = await insertJson(client, schema, "flightplans", projection("flightplans", sourceFlight, schema.writable.get("flightplans")!, ["regio_id", "user_id", "points", "status", ...SKIPPED_COLUMNS], { regio_id: region, user_id: actor.subject, status: "finished", points: sourceMembers.map(sourceId => Number(mappedId(pointMap, sourceId, "POINT"))) }));
  const destinationFlightId = id(flight); mappings.push({ type: "flight", source: id(sourceFlight), destination: destinationFlightId, created: true });
  const attachmentMap = new Map<string, string>();
  for (const value of payload.records.attachments) { const source = obj(value), created = await insertJson(client, schema, "attachments", projection("attachments", source, schema.writable.get("attachments")!, ["point_id"], { point_id: mappedId(pointMap, field(source, "point_id"), "POINT") })); attachmentMap.set(id(source), id(created)); mappings.push({ type: "attachment", source: id(source), destination: id(created), created: true }); }
  for (const value of payload.records.completions) { const source = obj(value), attachments = Array.isArray(source.attachments_id) ? source.attachments_id.map(value => Number(mappedId(attachmentMap, value, "ATTACHMENT"))) : []; await insertJson(client, schema, "finished_plans", projection("finished_plans", source, schema.writable.get("finished_plans")!, ["plan_id", "point_id", "attachments_id"], { plan_id: Number(destinationFlightId), point_id: Number(mappedId(pointMap, field(source, "point_id"), "POINT")), attachments_id: attachments })); }
  if (payload.records.path) { const source = obj(payload.records.path); await insertJson(client, schema, "finished_plans_path", projection("finished_plans_path", source, schema.writable.get("finished_plans_path")!, ["planid", "plan_id"], { planid: Number(destinationFlightId) })); }
  // Legacy log rows are intentionally skipped: they are not needed for the
  // completed flight and must never make a signed package unimportable.
  return { destinationFlightId, mappings };
}
