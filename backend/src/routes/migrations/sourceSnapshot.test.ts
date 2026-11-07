import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { captureFlightSnapshot, currentFlightDigest } from "./sourceSnapshot";
import { migrationConfig } from "./config";

const privateKey = generateKeyPairSync("ed25519").privateKey.export({ format: "pem", type: "pkcs8" }).toString();
const config = migrationConfig({ MIGRATION_SOURCE_INSTANCE_UUID: "11111111-1111-4111-8111-111111111111", MIGRATION_SOURCE_ISSUER: "tst", MIGRATION_EXPORT_SIGNING_KEY_ID: "fixture", MIGRATION_EXPORT_SIGNING_PRIVATE_KEY: privateKey });
let comment = "original";
const statements: string[] = [];
const client = {
  async query(sql: string) {
    statements.push(sql);
    if (sql.startsWith("BEGIN") || sql === "COMMIT" || sql === "ROLLBACK") return { rows: [] };
    if (sql.includes("FROM lis.flightplans fp WHERE fp.id")) return { rows: [{ row: { id: 7, points: [11], status: "finished", datum: "2025-01-01", password: "never-export", waarnemer: "lookup", copied_from: 3 } }] };
    if (sql.includes("FROM lis.points p JOIN lis.flightplans")) return { rows: [{ row: { id: 11, omschrijving: "point", geometry_id: null } }] };
    if (sql.includes("FROM lis.geometries")) return { rows: [] };
    if (sql.includes("FROM lis.finished_plans f WHERE")) return { rows: [{ row: { plan_id: 7, point_id: 11, point_order: 1, attachments_id: [], pointcomment: comment } }] };
    if (sql.includes("attachment_rows")) return { rows: [] };
    if (sql.includes("FROM lis.finished_plans_path")) return { rows: [] };
    if (sql.includes("FROM lis.logging")) return { rows: [{ row: { id: 9, flight_id: 4, planid: 7, pointid: 11, userid: "source-user", message: "saved" } }] };
    throw new Error(`Unexpected query: ${sql}`);
  },
  release() {},
};
const db = { async connect() { return client; } };
async function main() {
  const signed = await captureFlightSnapshot(db as any, "7", { subject: "source-admin" }, config);
  assert.equal(signed.payload.records.completions.length, 1);
  assert.ok(statements[0].includes("REPEATABLE READ READ ONLY"));
  assert.ok(statements.every(sql => !sql.includes("FOR SHARE")));
  assert.ok(statements.some(sql => sql.includes("jsonb_agg(to_jsonb(p) ORDER BY p.id)")));
  assert.ok(statements.some(sql => sql.includes("ORDER BY l.flight_id, l.id")));
  const exportedFlight = signed.payload.records.flight as Record<string, unknown>;
  assert.equal(exportedFlight.password, undefined);
  assert.equal(exportedFlight.waarnemer, undefined);
  assert.equal(exportedFlight.copied_from, undefined);
  assert.equal((signed.payload.records.logs[0] as Record<string, unknown>).userid, "source-user");
  const first = await currentFlightDigest(db as any, "7", config);
  comment = "edited after export";
  const second = await currentFlightDigest(db as any, "7", config);
  assert.notEqual(first, second);
  assert.equal(signed.payload.records.completions[0] && (signed.payload.records.completions[0] as any).pointcomment, "original");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
