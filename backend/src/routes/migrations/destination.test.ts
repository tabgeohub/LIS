import assert from "node:assert/strict";
import { ensureImportSchema, verifyPhotoReferences } from "./destination";
import { FinishedAtSchemaError } from "../../migrations/schemaPreflight";
import { migrationApiError } from "./security";
import type { PoolClient } from "pg";
import type { Response } from "express";
import type { FlightMigrationExportV1 } from "../../migrations/exportContract";

const base = (): FlightMigrationExportV1 => ({
  version: 1, source: { instance: "source", environment: "TST", issuer: "issuer", flightId: "1" }, exportId: "export", createdAt: "2026-11-09T10:00:00.000Z", expiresAt: "2026-11-09T11:00:00.000Z", exportedBy: { subject: "user", issuer: "issuer" },
  records: { flight: {}, points: [], geometries: [], completions: [], attachments: [{ id: 1, point_id: 2, attachmentid: 44, url: "https://services-eu1.arcgis.com/arcgis/rest/services/layer/FeatureServer/0/1/attachments/44" }], path: null, logs: [] }, counts: { points: 0, geometries: 0, completions: 0, attachments: 1, logs: 0 },
});
const allowed = ["https://services-eu1.arcgis.com"];
async function run() {
  // These fixture databases have no business data. Preflight must expose the
  // detected type and stop after its read-only metadata query.
  for (const detected of [{ data_type: "text", udt_name: "text" }, { data_type: "date", udt_name: "date" }, { data_type: "bigint", udt_name: "int8" }, null]) {
    const queries: string[] = [];
    const db = { query: async (sql: string) => {
      queries.push(sql);
      return { rows: detected ? [{ table_name: "finished_plans", column_name: "finished_at", ...detected }] : [] };
    } } as unknown as PoolClient;
    await assert.rejects(ensureImportSchema(db), (error: unknown) => {
      assert(error instanceof FinishedAtSchemaError);
      let status = 0;
      let body: any;
      const response = { status(value: number) { status = value; return this; }, json(value: unknown) { body = value; return this; } } as unknown as Response;
      migrationApiError(response, error);
      assert.equal(status, 422);
      assert.equal(body.code, "UNSUPPORTED_SCHEMA_FINISHED_AT");
      assert.equal(body.details.dataType, detected?.data_type ?? "missing");
      assert.equal(body.details.databaseType, detected?.udt_name ?? null);
      assert.match(body.message, /No data was imported/);
      return true;
    });
    assert.equal(queries.length, 1);
    assert.match(queries[0], /^SELECT .*information_schema.columns/);
  }
  assert.equal(await verifyPhotoReferences(base(), allowed, async () => 200), true);
  assert.equal(await verifyPhotoReferences(base(), allowed, async () => 404), false);
  const foreign = base(); (foreign.records.attachments[0] as Record<string, string>).url = "https://example.invalid/photo";
  assert.equal(await verifyPhotoReferences(foreign, allowed, async () => 200), false);
  const absent = base(); (absent.records.attachments[0] as Record<string, unknown>).url = undefined;
  assert.equal(await verifyPhotoReferences(absent, allowed, async () => 200), false);
  const missingIdentity = base(); delete (missingIdentity.records.attachments[0] as Record<string, unknown>).attachmentid;
  assert.equal(await verifyPhotoReferences(missingIdentity, allowed, async () => 200), false);
  console.log("destination attachment fixtures passed");
}
void run();
