/** Minimum observable columns inferred from repository queries, not a verified deployed schema. */
export const REQUIRED_COLUMNS: Record<string, string[]> = {
  flightplans: ["id", "regio_id", "status", "points"],
  points: ["id"],
  geometries: ["id"],
  finished_plans: ["plan_id", "point_id", "point_order", "attachments_id", "finished_at"],
  attachments: ["id", "point_id", "attachmentid", "url", "taken_at", "location"],
  finished_plans_path: ["planid", "path", "flighttime"],
  logging: ["flight_id"],
};
export interface SchemaColumn { table_name: string; column_name: string }
export type ImportColumn = SchemaColumn & { is_nullable: string; column_default: string | null; is_generated: string; identity_generation: string | null; data_type: string; udt_name?: string };
export type ImportSchema = { writable: Map<string, string[]>; required: Map<string, string[]> };
export const SKIPPED_COLUMNS = new Set(["copied_from", "organisatie", "organisatie_id", "activiteit", "activiteit_id", "activiteiten", "piloot", "waarnemer", "luchtvaartuig"]);
export function missingRequiredColumns(columns: SchemaColumn[]): string[] {
  const present = new Set(columns.map(c => `${c.table_name}.${c.column_name}`));
  return Object.entries(REQUIRED_COLUMNS).flatMap(([table, names]) => names.filter(name => !present.has(`${table}.${name}`)).map(name => `${table}.${name}`));
}
export async function inspectMinimumSchema(db: { query(sql: string, params: string[][]): Promise<{ rows: SchemaColumn[] }> }): Promise<string[]> {
  const result = await db.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'lis' AND table_name = ANY($1::text[])", [Object.keys(REQUIRED_COLUMNS)]);
  return missingRequiredColumns(result.rows);
}
