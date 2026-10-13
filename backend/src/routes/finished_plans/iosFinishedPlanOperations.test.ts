import assert from "node:assert/strict";
import test from "node:test";
import { finishedPlanPayloadHash, submitFinishedPlanIdempotently, validateFinishedPlanSubmitInput } from "./iosFinishedPlanOperations";

const principal = { subject: "keycloak-a", regio_id: "RWS TEST", is_admin: false };
function request(notes = "field note") {
  return validateFinishedPlanSubmitInput({ operation_key: "22222222-2222-4222-8222-222222222222", package_hash: "c".repeat(64),
    package_payload: { immutable: true, geometry_observations: [{ members: ["a", "b"] }], track: [{ latitude: 52, longitude: 4 }], duration: 13 },
    plan: { id: 7, points: [{ id: 11, omschrijving: notes, comment: notes, order: 1, spoed: 0, sendToEmail: null, attachments: [] }], pathData: [], flightTime: 13 } })!;
}

function poolFixture() {
  let status = "prepared";
  let receipt: any;
  const query = async (sql: string, params: any[] = []) => {
    if (sql.includes("SELECT id, regio_id, status FROM lis.flightPlans")) return { rows: [{ id: 7, regio_id: "RWS TEST", status }], rowCount: 1 };
    if (sql.includes("ios_finished_plan_receipts WHERE operation_key")) return { rows: receipt ? [receipt] : [], rowCount: receipt ? 1 : 0 };
    if (sql.includes("FROM lis.flightplan_claims")) return { rows: [{ owner_subject: "keycloak-a", expires_at: new Date(Date.now() + 60_000) }], rowCount: 1 };
    if (sql.includes("UPDATE lis.points")) return { rows: [], rowCount: 1 };
    if (sql.includes("UPDATE lis.flightplans SET points")) return { rows: [], rowCount: 1 };
    if (sql.includes("UPDATE lis.flightplans SET status")) { status = "finished"; return { rows: [], rowCount: 1 }; }
    if (sql.includes("INSERT INTO lis.finished_plans_path")) return { rows: [], rowCount: 1 };
    if (sql.includes("SELECT MAX(point_order)")) return { rows: [{ max_order: 0 }], rowCount: 1 };
    if (sql.includes("SELECT 1 FROM lis.points")) return { rows: [{ exists: 1 }], rowCount: 1 };
    if (sql.includes("INSERT INTO lis.finished_plans")) return { rows: [], rowCount: 1 };
    if (sql.includes("INSERT INTO lis.ios_finished_plan_receipts")) {
      receipt = { operation_key: params[0], owner_subject: params[1], plan_id: params[2], package_hash: params[3], payload_hash: params[4], accepted_at: new Date() };
      return { rows: [receipt], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  };
  return { connect: async () => ({ query, release() {} }) } as any;
}

test("finished-plan receipt survives a repeated lost-response submission and rejects a payload conflict", async () => {
  const db = poolFixture();
  const accepted = await submitFinishedPlanIdempotently(request(), principal, db);
  const repeated = await submitFinishedPlanIdempotently(request(), principal, db);
  const conflict = await submitFinishedPlanIdempotently(request("different note"), principal, db);
  assert.equal(accepted.kind, "confirmed"); assert.equal(repeated.kind, "confirmed"); assert.equal(conflict.kind, "conflict");
  if (accepted.kind === "confirmed" && repeated.kind === "confirmed") assert.deepEqual(repeated.receipt, accepted.receipt);
});

test("payload identity includes immutable geometry, track and duration rather than transaction timing", () => {
  const first = request(); const changed = request();
  assert.equal(finishedPlanPayloadHash(first), finishedPlanPayloadHash(changed));
  const other = request(); other.package_payload = { immutable: true, geometry_observations: [{ members: ["a", "b"] }], track: [{ latitude: 53, longitude: 4 }], duration: 13 };
  assert.notEqual(finishedPlanPayloadHash(first), finishedPlanPayloadHash(other));
});
