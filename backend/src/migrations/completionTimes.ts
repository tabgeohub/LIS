import type { FlightMigrationExportV1 } from "./exportContract";
import type { ImportColumn } from "./schemaPreflight";

/** Validate before preview or any writes. Do not invent a date or truncate one. */
export function validateCompletionTimes(payload: FlightMigrationExportV1, column: ImportColumn): void {
  for (const completion of payload.records.completions) {
    if (!completion || typeof completion !== "object" || Array.isArray(completion)) throw new Error("INVALID_EXPORT_STRUCTURE");
    const value = completion.finished_at;
    if (value === null || value === undefined) {
      // Explicit nulls must not be replaced by a default/current time.
      if (column.is_nullable === "NO" && (value === null || !column.column_default)) throw new Error("INVALID_COMPLETION_TIME_NULL_NOT_ALLOWED");
      continue;
    }
    if (column.data_type === "time without time zone") {
      // PostgreSQL TIME has microsecond precision and also supports 24:00:00.
      if (typeof value !== "string" || !/^(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?|24:00:00(?:\.0{1,6})?)$/.test(value)) {
        throw new Error("INVALID_COMPLETION_TIME_EXPECTED_TIME_WITHOUT_DATE_OR_ZONE");
      }
    }
  }
}
