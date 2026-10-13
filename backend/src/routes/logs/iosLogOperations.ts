import crypto from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { pool } from "../../db";
import type { PlanPrincipal } from "../flightPlans/planAccess";
import { hasPlanRegionAccess } from "../flightPlans/planAccess";

export type IOSLogEntry = Record<string, unknown>;
export type IOSLogInput = { operation_key: string; package_hash: string; plan_id: number; log_sha256: string; logs: IOSLogEntry[] };
export type IOSLogReceipt = { operation_key: string; plan_id: number; package_hash: string; log_sha256: string; log_count: number; accepted_at?: string };
type StoredReceipt = IOSLogReceipt & { owner_subject: string; payload_hash: string };

const uuid = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const hash = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value as Record<string, unknown>).sort().map(key => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
export function iosLogPayloadHash(input: Omit<IOSLogInput, "operation_key">): string {
  return crypto.createHash("sha256").update(canonical(input)).digest("hex");
}
export function validateIOSLogInput(value: unknown): IOSLogInput | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (!uuid(raw.operation_key) || !hash(raw.package_hash) || !hash(raw.log_sha256) || !Number.isSafeInteger(raw.plan_id) || !Array.isArray(raw.logs) || raw.logs.length === 0 || raw.logs.some(log => !log || typeof log !== "object" || Array.isArray(log))) return null;
  return { operation_key: raw.operation_key, package_hash: raw.package_hash.toLowerCase(), plan_id: raw.plan_id as number, log_sha256: raw.log_sha256.toLowerCase(), logs: raw.logs as IOSLogEntry[] };
}
function receipt(row: any): IOSLogReceipt { return { operation_key: row.operation_key, plan_id: Number(row.plan_id), package_hash: row.package_hash, log_sha256: row.log_sha256, log_count: Number(row.log_count), accepted_at: row.accepted_at ? new Date(row.accepted_at).toISOString() : undefined }; }
async function authorizedFinishedPlan(client: PoolClient, planID: number, principal: PlanPrincipal): Promise<boolean> {
  const plan = (await client.query("SELECT regio_id, status FROM lis.flightPlans WHERE id = $1 FOR UPDATE", [planID])).rows[0];
  if (!plan || !hasPlanRegionAccess(principal, plan.regio_id) || plan.status !== "finished") return false;
  // Logs are a post-plan stage: require the same owner's durable plan receipt.
  return ((await client.query("SELECT 1 FROM lis.ios_finished_plan_receipts WHERE owner_subject = $1 AND plan_id = $2", [principal.subject, planID])).rowCount ?? 0) > 0;
}

export type IOSLogResult = { kind: "confirmed"; receipt: IOSLogReceipt } | { kind: "forbidden" | "plan_not_confirmed" | "conflict" | "schema_required" };

/**
 * New mobile log writes are all-or-nothing.  The advisory transaction lock
 * keeps the legacy MAX(flight_id)+1 convention safe without changing the
 * existing Desktop route or creating schema at request time.
 */
export async function submitIOSLogsIdempotently(input: IOSLogInput, principal: PlanPrincipal, db: Pick<Pool, "connect"> = pool): Promise<IOSLogResult> {
  const client = await db.connect();
  try {
    const payloadHash = iosLogPayloadHash(input);
    await client.query("BEGIN");
    const existing = (await client.query("SELECT * FROM lis.ios_log_operation_receipts WHERE operation_key = $1 FOR UPDATE", [input.operation_key])).rows[0] as StoredReceipt | undefined;
    if (existing) {
      const same = existing.owner_subject === principal.subject && Number(existing.plan_id) === input.plan_id && existing.package_hash === input.package_hash && existing.log_sha256 === input.log_sha256 && existing.payload_hash === payloadHash;
      await client.query("COMMIT");
      return same ? { kind: "confirmed", receipt: receipt(existing) } : { kind: "conflict" };
    }
    if (!(await authorizedFinishedPlan(client, input.plan_id, principal))) { await client.query("ROLLBACK"); return { kind: "plan_not_confirmed" }; }
    await client.query("SELECT pg_advisory_xact_lock(hashtext('lis.logging.flight_id'))");
    const next = (await client.query("SELECT COALESCE(MAX(flight_id), 0) + 1 AS flight_id FROM lis.logging")).rows[0].flight_id;
    for (const log of input.logs) {
      await client.query(
        `INSERT INTO lis.logging (flight_id, message, userid, userName, userRole, planId, pointId, date, isOnline, gpsConnected, oldData, newData, currentLocation)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13::jsonb)`,
        [next, log.message || "", log.userId || "", log.userName || "", log.userRole || "", log.planId || input.plan_id, log.pointId || 0, log.date || "", log.isOnline || false, log.gpsConnected || false, JSON.stringify(log.oldData ?? null), JSON.stringify(log.newData ?? null), JSON.stringify(log.currentLocation ?? null)]
      );
    }
    const inserted = (await client.query(
      `INSERT INTO lis.ios_log_operation_receipts (operation_key, owner_subject, plan_id, package_hash, log_sha256, payload_hash, log_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [input.operation_key, principal.subject, input.plan_id, input.package_hash, input.log_sha256, payloadHash, input.logs.length]
    )).rows[0];
    await client.query("COMMIT");
    return { kind: "confirmed", receipt: receipt(inserted) };
  } catch (error: any) {
    try { await client.query("ROLLBACK"); } catch { /* original error wins */ }
    if (error?.code === "42P01") return { kind: "schema_required" };
    throw error;
  } finally { client.release(); }
}

export async function readIOSLogReceipt(operationKey: string, principal: PlanPrincipal, db: Pick<Pool, "query"> = pool): Promise<IOSLogReceipt | null> {
  const result = await db.query(
    `SELECT r.* FROM lis.ios_log_operation_receipts r JOIN lis.flightPlans fp ON fp.id = r.plan_id
     WHERE r.operation_key = $1 AND r.owner_subject = $2 AND (fp.regio_id = $3 OR $4::boolean)`,
    [operationKey, principal.subject, principal.regio_id, principal.is_admin]
  );
  return result.rows[0] ? receipt(result.rows[0]) : null;
}
