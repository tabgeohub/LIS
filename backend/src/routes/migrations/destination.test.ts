import assert from "node:assert/strict";
import { verifyPhotoReferences } from "./destination";
import type { FlightMigrationExportV1 } from "../../migrations/exportContract";

const base = (): FlightMigrationExportV1 => ({
  version: 1, source: { instance: "source", environment: "TST", issuer: "issuer", flightId: "1" }, exportId: "export", createdAt: "2026-11-09T10:00:00.000Z", expiresAt: "2026-11-09T11:00:00.000Z", exportedBy: { subject: "user", issuer: "issuer" },
  records: { flight: {}, points: [], geometries: [], completions: [], attachments: [{ id: 1, point_id: 2, attachmentid: 44, url: "https://services-eu1.arcgis.com/arcgis/rest/services/layer/FeatureServer/0/1/attachments/44" }], path: null, logs: [] }, counts: { points: 0, geometries: 0, completions: 0, attachments: 1, logs: 0 },
});
const allowed = ["https://services-eu1.arcgis.com"];
async function run() {
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
