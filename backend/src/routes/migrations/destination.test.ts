import assert from "node:assert/strict";
import { matchGeometry, matchPoint, type MatchPoint } from "../../migrations/matching";
import { verifyPhotoReferences } from "./destination";
import type { FlightMigrationExportV1 } from "../../migrations/exportContract";

const point: MatchPoint = { id: "source", name: " Café ", region: "RWS A", latitude: 1, longitude: 2, rdX: 3, rdY: 4, geometryId: null };
assert.equal(matchPoint(point, [{ ...point, id: "prod", name: "Cafe\u0301" }], "RWS A").kind, "reuse");
assert.equal(matchPoint(point, [{ ...point, id: "one" }, { ...point, id: "two" }], "RWS A").kind, "conflict");
assert.equal(matchPoint(point, [{ ...point, region: "RWS B" }], "RWS A").kind, "conflict");
const geometry = { id: "g", name: "Line", region: "RWS A", type: "line", vertices: [point, { ...point, id: "v2", name: "two", latitude: 5 }] };
assert.equal(matchGeometry(geometry, [{ ...geometry, id: "prod" }], "RWS A").kind, "reuse");
assert.equal(matchGeometry(geometry, [{ ...geometry, vertices: [...geometry.vertices].reverse() }], "RWS A").kind, "conflict");

const payload = { version: 1, source: { instance: "source", environment: "TST", issuer: "issuer", flightId: "1" }, exportId: "export", createdAt: "2026-01-01T00:00:00.000Z", expiresAt: "2026-01-02T00:00:00.000Z", exportedBy: { subject: "source", issuer: "issuer" }, records: { flight: { id: 1 }, points: [], geometries: [], completions: [], attachments: [{ id: 1, point_id: 2, attachmentid: 88, url: "https://arcgis.example/photos/88" }], path: null, logs: [] }, counts: { points: 0, geometries: 0, completions: 0, attachments: 1, logs: 0 } } as unknown as FlightMigrationExportV1;
async function main() {
  const seen: string[] = [];
  assert.equal(await verifyPhotoReferences(payload, ["https://arcgis.example"], async url => { seen.push(url.toString()); return 204; }), true);
  assert.deepEqual(seen, ["https://arcgis.example/photos/88"]);
  assert.equal(await verifyPhotoReferences(payload, ["https://arcgis.example"], async () => 404), false);
  assert.equal(await verifyPhotoReferences({ ...payload, records: { ...payload.records, attachments: [{ id: 1, url: "https://other.example/photo" }] } }, ["https://arcgis.example"], async () => 200), false);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
