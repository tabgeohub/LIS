export const REQUIRED_COLUMNS: Record<string, string[]> = {
  flightplans: ["id", "regio_id", "status", "points"], points: ["id"], geometries: ["id"],
  finished_plans: ["plan_id", "point_id", "point_order", "attachments_id", "finished_at"],
  attachments: ["id", "point_id", "attachmentid", "url", "taken_at", "location"],
  finished_plans_path: ["planid", "path", "flighttime"],
};
export interface SchemaColumn { table_name: string; column_name: string }
export type ImportColumn = SchemaColumn & { is_nullable: string; column_default: string | null; is_generated: string; identity_generation: string | null; data_type: string; udt_name?: string };
export type ImportSchema = { writable: Map<string, string[]>; required: Map<string, string[]>; finishedAtColumn: ImportColumn };
export const FINISHED_AT_TYPES = ["timestamp with time zone", "timestamp without time zone", "time without time zone"];
/** Only schema metadata is exposed; no completion records or credentials. */
export class FinishedAtSchemaError extends Error {
  readonly code = "UNSUPPORTED_SCHEMA_FINISHED_AT";
  readonly details: { column: string; dataType: string; databaseType: string | null };

  constructor(column: ImportColumn | undefined) {
    const dataType = column?.data_type ?? "missing";
    const databaseType = column?.udt_name ?? null;
    super(`PROD completion time column lis.finished_plans.finished_at: ${dataType}${databaseType ? ` (${databaseType})` : ""}. The importer supports timestamp with time zone, timestamp without time zone, or time without time zone. No data was imported.`);
    this.details = { column: "lis.finished_plans.finished_at", dataType, databaseType };
  }
}
export const SKIPPED_COLUMNS = new Set(["copied_from", "organisatie", "organisatie_id", "activiteit", "activiteit_id", "activiteiten", "piloot", "waarnemer", "luchtvaartuig"]);
export function missingRequiredColumns(columns: SchemaColumn[]): string[] {
  const present = new Set(columns.map(column => `${column.table_name}.${column.column_name}`));
  return Object.entries(REQUIRED_COLUMNS).flatMap(([table, names]) => names.filter(name => !present.has(`${table}.${name}`)).map(name => `${table}.${name}`));
}
