import assert from "node:assert/strict";
import test from "node:test";
import crypto from "node:crypto";
import {
  reconcileOrCreatePhoto,
  setArcgisPhotoProviderForTests,
  type ArcgisPhotoProvider,
  validatePhotoOperationInput,
} from "./iosPhotoOperations";

const bytes = Buffer.from("mock-photo-bytes");
const sha = crypto.createHash("sha256").update(bytes).digest("hex");
const principal = { subject: "keycloak-a", regio_id: "RWS TEST", is_admin: false };
function input(packageHash = "a".repeat(64)) {
  return validatePhotoOperationInput({ operation_key: "11111111-1111-4111-8111-111111111111", package_hash: packageHash,
    local_attachment_id: "photo-a", owner_point_id: 11, plan_id: 7, attachment_sha256: sha, mime_type: "image/jpeg" }, bytes)!;
}

/** Deliberately local in-memory SQL fixture: it proves application branching,
 * not PostgreSQL locking or a real ArcGIS provider. */
function fixturePool() {
  const rows = new Map<string, any>();
  const query = async (sql: string, params: any[] = []) => {
    if (sql.includes("SELECT fp.id FROM lis.flightPlans")) return { rows: [{ id: 7 }], rowCount: 1 };
    if (sql.includes("SELECT * FROM lis.ios_photo_operations")) return { rows: rows.has(params[0]) ? [rows.get(params[0])] : [], rowCount: rows.has(params[0]) ? 1 : 0 };
    if (sql.includes("INSERT INTO lis.ios_photo_operations")) {
      const row = { operation_key: params[0], owner_subject: params[1], plan_id: params[2], owner_point_id: params[3], package_hash: params[4], local_attachment_id: params[5], payload_hash: params[6], outcome: "pending", provider_evidence: {} };
      rows.set(params[0], row); return { rows: [], rowCount: 1 };
    }
    if (sql.includes("UPDATE lis.ios_photo_operations")) {
      const row = rows.get(params[0]); Object.assign(row, { outcome: params[1], feature_object_id: params[2], provider_attachment_id: params[3], remote_url: params[4], provider_evidence: JSON.parse(params[5]) });
      return { rows: [row], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  };
  return { connect: async () => ({ query, release() {} }) } as any;
}

test("photo confirmation is durable and repeated operation identity reuses the distinct receipt", async () => {
  let creates = 0;
  const provider: ArcgisPhotoProvider = {
    async readback() { return { outcome: "not_created", evidence: { source: "mock readback" } }; },
    async create() { creates += 1; return { outcome: "confirmed", receipt: { feature_object_id: 81, attachment_id: 91, url: "https://mock/91", evidence: { source: "mock create" } } }; },
  };
  setArcgisPhotoProviderForTests(provider);
  const db = fixturePool();
  const first = await reconcileOrCreatePhoto(input(), principal, db);
  const repeated = await reconcileOrCreatePhoto(input(), principal, db);
  assert.equal(first.outcome, "confirmed"); assert.equal(repeated.outcome, "confirmed");
  assert.deepEqual(repeated.receipt && [repeated.receipt.feature_object_id, repeated.receipt.attachment_id, repeated.receipt.url], [81, 91, "https://mock/91"]);
  assert.equal(creates, 1);
  setArcgisPhotoProviderForTests(null);
});

test("uncertain provider evidence is retained and never advances to a blind create", async () => {
  let creates = 0;
  setArcgisPhotoProviderForTests({ async readback() { return { outcome: "uncertain", evidence: { source: "lost response" } }; }, async create() { creates += 1; return { outcome: "not_created", evidence: {} }; } });
  const result = await reconcileOrCreatePhoto(input(), principal, fixturePool());
  assert.equal(result.httpStatus, 202); assert.equal(result.outcome, "uncertain"); assert.equal(creates, 0);
  setArcgisPhotoProviderForTests(null);
});

test("operation key cannot be rebound to a different photo package", async () => {
  setArcgisPhotoProviderForTests({ async readback() { return { outcome: "not_created", evidence: {} }; }, async create() { return { outcome: "confirmed", receipt: { feature_object_id: 1, attachment_id: 2, url: "https://mock/2", evidence: {} } }; } });
  const db = fixturePool();
  await reconcileOrCreatePhoto(input(), principal, db);
  const conflict = await reconcileOrCreatePhoto(input("b".repeat(64)), principal, db);
  assert.equal(conflict.code, "PHOTO_OPERATION_KEY_CONFLICT");
  setArcgisPhotoProviderForTests(null);
});
