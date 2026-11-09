import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { canonicalJson, verifyExport, type FlightMigrationExportV1, type SignedExport } from "./exportContract";
import { matchGeometry, matchPoint, normalizedName } from "./matching";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString();
function payload(overrides: Partial<FlightMigrationExportV1> = {}): FlightMigrationExportV1 {
  return {
    version: 1,
    source: { instance: "9c8b5118-6688-4dbb-8b07-124b72ed00d0", environment: "TST", issuer: "https://tst.example", flightId: "44" },
    exportId: "package-1", createdAt: "2026-11-09T10:00:00.000Z", expiresAt: "2026-11-09T11:00:00.000Z",
    exportedBy: { subject: "tst-admin", issuer: "https://tst.example" },
    records: { flight: { id: 44, vluchtnummer: "TST-44", points: [1] }, points: [{ id: 1, omschrijving: "P", latitude: 1, longitude: 2, xcoordinaat_rd: 3, ycoordinaat_rd: 4, geometry_id: null }], geometries: [], completions: [{ id: 1, plan_id: 44, point_id: 1, attachments_id: [] }], attachments: [], path: null, logs: [] },
    counts: { points: 1, geometries: 0, completions: 1, attachments: 0, logs: 0 }, ...overrides,
  };
}
function envelope(value = payload()): SignedExport {
  const bytes = Buffer.from(canonicalJson(value as never));
  return { payload: value, digest: createHash("sha256").update(bytes).digest("hex"), keyId: "fixture-key", signature: sign(null, bytes, privateKey).toString("base64url") };
}
const now = Date.parse("2026-11-09T10:30:00.000Z");
const keys = { "fixture-key": publicPem };

assert.equal(verifyExport(envelope(), keys, now).source.flightId, "44");
assert.throws(() => verifyExport({ ...envelope(), digest: "0".repeat(64) }, keys, now), /INVALID_EXPORT_SIGNATURE/);
assert.throws(() => verifyExport({ ...envelope(), keyId: "unknown" }, keys, now), /UNKNOWN_SIGNING_KEY/);
assert.throws(() => verifyExport(envelope(payload({ expiresAt: "2026-11-09T10:20:00.000Z" })), keys, now), /EXPORT_EXPIRED/);
assert.throws(() => verifyExport(envelope(payload({ counts: { points: 0, geometries: 0, completions: 0, attachments: 0, logs: 0 } })), keys, now), /INVALID_EXPORT_COUNTS/);
assert.throws(() => verifyExport(envelope(payload({ records: { ...payload().records, completions: [] }, counts: { points: 1, geometries: 0, completions: 0, attachments: 0, logs: 0 } })), keys, now), /INVALID_EXPORT_STRUCTURE/);
assert.equal(normalizedName("  cafe\u0301 "), "café");

const point = { id: "1", name: "  cafe\u0301 ", region: "R", latitude: 1, longitude: 2, rdX: 3, rdY: 4, geometryId: null };
assert.equal(matchPoint(point, [{ ...point, id: "7", name: "café" }], "R").kind, "reuse");
assert.equal(matchPoint(point, [{ ...point, id: "7", name: "café" }, { ...point, id: "8", name: "café" }], "R").kind, "conflict");
const geometry = { id: "g1", name: "G", region: "R", type: "polygon", vertices: [{ ...point, geometryId: "g1" }] };
assert.equal(matchGeometry(geometry, [{ ...geometry, id: "g2", vertices: [{ ...point, geometryId: "g2" }] }], "R").kind, "reuse");
assert.equal(matchGeometry(geometry, [{ ...geometry, id: "g2", vertices: [{ ...point, latitude: 2, geometryId: "g2" }] }], "R").kind, "conflict");
console.log("migration primitive fixtures passed");
