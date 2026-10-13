import type { Pool } from "pg";
import type { PlanPrincipal } from "../flightPlans/planAccess";
import { hasPlanRegionAccess } from "../flightPlans/planAccess";
import { digest, RecoverySigner, recoverySigner, validOperationKey } from "../iosRecovery";
import { WritePermits } from "../iosWritePermit";
import { insertLogBatch, normalizedLog } from "./logBatchWriter";
import { buildLogInsertValues } from "../../helpers/queries/logs/logFields";
export type IOSLogEntry = Record<string, unknown>;
export type IOSLogInput = { operation_key: string; package_hash: string; plan_id: number; log_sha256: string; logs: IOSLogEntry[]; phase?: "prepare" | "write"; write_permit?: string; recovery_context?: string };
export type IOSLogReceipt = { operation_key: string; plan_id: number; package_hash: string; log_sha256: string; log_count: number; flight_id: number; recovery_context: string; provenance: "direct_commit" | "state_verified" };
export const iosLogPayloadHash = (input: Omit<IOSLogInput, "operation_key">): string => digest(input);
export function validateIOSLogInput(value: unknown): IOSLogInput | null {
  const r = value as IOSLogInput;
  if (!r || !validOperationKey(r.operation_key) || !/^[a-f0-9]{64}$/.test(r.package_hash) || !/^[a-f0-9]{64}$/.test(r.log_sha256) ||
    !Number.isSafeInteger(r.plan_id) || r.plan_id <= 0 || !Array.isArray(r.logs) || !r.logs.length ||
    r.logs.some(l => !l || typeof l !== "object" || Array.isArray(l) || (l.planId != null && Number(l.planId) !== r.plan_id))) return null;
  return r;
}
export type IOSLogResult = { kind: "confirmed"; receipt: IOSLogReceipt } | { kind: "prepared"; write_permit: string } | { kind: "plan_not_confirmed" | "conflict" | "uncertain" };
const permits = new WritePermits();
/** Repeated writes, including after restart, cannot consume a permit twice. */
export async function submitIOSLogsIdempotently(input: IOSLogInput, principal: PlanPrincipal, db?: Pick<Pool, "connect" | "query">, signer?: RecoverySigner): Promise<IOSLogResult> {
  db ||= require("../../db").pool; signer ||= recoverySigner();
  if (!validateIOSLogInput(input)) return { kind: "conflict" };
  if (input.recovery_context) {
    const evidence = signer.verify(input.recovery_context, "logs", principal.subject);
    if (evidence.rows_hash !== digest(input.logs.map(l => buildLogInsertValues(evidence.flight_id, normalizedLog({ ...l, planId: input.plan_id }))))) return { kind: "conflict" };
    const receipt = await readIOSLogReceipt(input.operation_key, principal, db, input.recovery_context, signer);
    return receipt && receipt.package_hash === input.package_hash && receipt.log_sha256 === input.log_sha256 &&
      receipt.plan_id === input.plan_id && receipt.log_count === input.logs.length ? { kind: "confirmed", receipt } : { kind: "uncertain" };
  }
  const binding = { operation_key: input.operation_key, package_hash: input.package_hash, plan_id: input.plan_id, log_sha256: input.log_sha256, logs: input.logs };
  const hash = digest(binding);
  const client = await db!.connect();
  try {
    await client.query("BEGIN");
    const plan = (await client.query("SELECT regio_id, status FROM lis.flightPlans WHERE id = $1 FOR UPDATE", [input.plan_id])).rows[0];
    if (!plan || !hasPlanRegionAccess(principal, plan.regio_id) || plan.status !== "finished") { await client.query("ROLLBACK"); return { kind: "plan_not_confirmed" }; }
    if (input.phase === "prepare") {
      const permit = permits.issue(principal.subject, "logs/" + input.operation_key, hash, signer);
      await client.query("COMMIT"); return { kind: "prepared", write_permit: permit };
    }
    if (input.phase !== "write" || !input.write_permit) { await client.query("ROLLBACK"); return { kind: "uncertain" }; }
    try { permits.consume(principal.subject, "logs/" + input.operation_key, hash, input.write_permit, signer); }
    catch { await client.query("ROLLBACK"); return { kind: "uncertain" }; }
    const logs = input.logs.map(l => normalizedLog({ ...l, planId: input.plan_id }));
    const flight = await insertLogBatch(client, logs);
    const evidence = { operation_key: input.operation_key, package_hash: input.package_hash, plan_id: input.plan_id, log_sha256: input.log_sha256,
      log_count: logs.length, flight_id: flight, rows_hash: digest(logs.map(l => buildLogInsertValues(flight, l))) };
    const context = signer.sign("logs", principal.subject, evidence);
    await client.query("COMMIT");
    return { kind: "confirmed", receipt: { ...evidence, recovery_context: context, provenance: "direct_commit" } };
  } catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; }
  finally { client.release(); }
}
export async function readIOSLogReceipt(operationKey: string, principal: PlanPrincipal, db?: Pick<Pool, "query">, context?: string, signer?: RecoverySigner): Promise<IOSLogReceipt | null> {
  if (!context) return null;
  signer ||= recoverySigner();
  const evidence = signer.verify(context, "logs", principal.subject);
  if (evidence.operation_key !== operationKey) throw new Error("RECOVERY_CONTEXT_CONFLICT");
  db ||= require("../../db").pool;
  const plan = (await db!.query("SELECT regio_id, status FROM lis.flightPlans WHERE id = $1", [evidence.plan_id])).rows[0];
  if (!plan || !hasPlanRegionAccess(principal, plan.regio_id) || plan.status !== "finished") return null;
  const rows = (await db!.query("SELECT * FROM lis.logging WHERE flight_id = $1 ORDER BY id", [evidence.flight_id])).rows;
  const values = rows.map(r => buildLogInsertValues(Number(r.flight_id), normalizedLog({ message: r.message, userId: r.userid, userName: r.username, userRole: r.userrole,
    planId: Number(r.planid), pointId: Number(r.pointid), date: r.date instanceof Date ? r.date.toISOString() : r.date, isOnline: r.isonline, gpsConnected: r.gpsconnected,
    oldData: r.olddata, newData: r.newdata, currentLocation: r.currentlocation })));
  if (rows.length !== evidence.log_count || digest(values) !== evidence.rows_hash) return null;
  return { ...(evidence as IOSLogReceipt), recovery_context: context, provenance: "state_verified" };
}
