import assert from "node:assert/strict";
import test from "node:test";
import { readIOSLogReceipt, submitIOSLogsIdempotently, validateIOSLogInput } from "./iosLogOperations";

const principal = { subject: "keycloak-a", regio_id: "RWS TEST", is_admin: false };
function input(message = "field log") {
  return validateIOSLogInput({ operation_key: "33333333-3333-4333-8333-333333333333", package_hash: "d".repeat(64), plan_id: 7, log_sha256: "e".repeat(64), logs: [{ message, pointId: 11, oldData: { a: 1 }, newData: { a: 2 } }] })!;
}
/** Synthetic transactional fixture: validates partial-write rollback paths and
 * idempotency branching, not a substitute for PostgreSQL locking evidence. */
function fixturePool({ failInsertAt }: { failInsertAt?: number } = {}) {
  let receipt: any; let insertedLogs = 0; let committedLogs = 0; let inTransaction = false;
  const query = async (sql: string, params: any[] = []) => {
    if (sql === "BEGIN") { inTransaction = true; insertedLogs = 0; return { rows: [], rowCount: 0 }; }
    if (sql === "COMMIT") { if (inTransaction) committedLogs += insertedLogs; inTransaction = false; return { rows: [], rowCount: 0 }; }
    if (sql === "ROLLBACK") { inTransaction = false; insertedLogs = 0; return { rows: [], rowCount: 0 }; }
    if (sql.includes("ios_log_operation_receipts WHERE operation_key") || sql.includes("SELECT r.* FROM lis.ios_log_operation_receipts")) return { rows: receipt ? [receipt] : [], rowCount: receipt ? 1 : 0 };
    if (sql.includes("SELECT regio_id, status")) return { rows: [{ regio_id: "RWS TEST", status: "finished" }], rowCount: 1 };
    if (sql.includes("FROM lis.ios_finished_plan_receipts")) return { rows: [{ ok: 1 }], rowCount: 1 };
    if (sql.includes("pg_advisory_xact_lock")) return { rows: [], rowCount: 1 };
    if (sql.includes("COALESCE(MAX(flight_id)")) return { rows: [{ flight_id: 41 }], rowCount: 1 };
    if (sql.includes("INSERT INTO lis.logging")) { insertedLogs += 1; if (failInsertAt === insertedLogs) throw new Error("synthetic partial failure"); return { rows: [], rowCount: 1 }; }
    if (sql.includes("INSERT INTO lis.ios_log_operation_receipts")) { receipt = { operation_key: params[0], owner_subject: params[1], plan_id: params[2], package_hash: params[3], log_sha256: params[4], payload_hash: params[5], log_count: params[6], accepted_at: new Date() }; return { rows: [receipt], rowCount: 1 }; }
    return { rows: [], rowCount: 0 };
  };
  return { db: { connect: async () => ({ query, release() {} }), query } as any, committedLogs: () => committedLogs };
}

test("lost acknowledgement reuses one durable log receipt and does not duplicate logs", async () => {
  const fixture = fixturePool();
  const first = await submitIOSLogsIdempotently(input(), principal, fixture.db);
  const repeated = await submitIOSLogsIdempotently(input(), principal, fixture.db);
  assert.equal(first.kind, "confirmed"); assert.equal(repeated.kind, "confirmed");
  assert.equal(fixture.committedLogs(), 1);
  if (first.kind === "confirmed") assert.equal((await readIOSLogReceipt(first.receipt.operation_key, principal, fixture.db))?.log_count, 1);
});

test("conflicting reuse is rejected and a partial log write cannot leave a receipt", async () => {
  const fixture = fixturePool();
  const accepted = await submitIOSLogsIdempotently(input(), principal, fixture.db);
  const conflict = await submitIOSLogsIdempotently(input("changed"), principal, fixture.db);
  assert.equal(accepted.kind, "confirmed"); assert.equal(conflict.kind, "conflict");
  const broken = fixturePool({ failInsertAt: 1 });
  await assert.rejects(() => submitIOSLogsIdempotently(input(), principal, broken.db));
  assert.equal(broken.committedLogs(), 0);
});

test("empty log batches are rejected rather than acknowledged as delivery", () => {
  assert.equal(validateIOSLogInput({ operation_key: "33333333-3333-4333-8333-333333333333", package_hash: "d".repeat(64), plan_id: 7, log_sha256: "e".repeat(64), logs: [] }), null);
});
