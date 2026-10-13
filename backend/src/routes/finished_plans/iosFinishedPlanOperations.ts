import crypto from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { pool } from "../../db";
import { saveFinishedPlanInTransaction } from "../../helpers/finished-plans/createFinishedPlanDb";
import { type IncomingPlan } from "../../helpers/validators/finishedPlan";
import type { PlanPrincipal } from "../flightPlans/planAccess";
import { hasPlanRegionAccess } from "../flightPlans/planAccess";

export type FinishedPlanSubmitInput = {
  operation_key: string;
  package_hash: string;
  plan: IncomingPlan;
  /** Full immutable mobile payload retained only by the client/package today. */
  package_payload: unknown;
};
export type FinishedPlanReceipt = { operation_key: string; planId: number; package_hash: string; payload_hash: string; accepted_at?: string };
type ReceiptRow = FinishedPlanReceipt & { owner_subject: string; plan_id: number };

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function isHash(value: unknown): value is string { return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value); }

/** Stable key ordering makes conflicting reuse detect the actual submitted shape. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value as Record<string, unknown>).sort().map(k => `${JSON.stringify(k)}:${canonical((value as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(value);
}
export function finishedPlanPayloadHash(input: Pick<FinishedPlanSubmitInput, "package_hash" | "plan" | "package_payload">): string {
  return crypto.createHash("sha256").update(canonical({ package_hash: input.package_hash, plan: input.plan, package_payload: input.package_payload })).digest("hex");
}
export function validateFinishedPlanSubmitInput(value: unknown): FinishedPlanSubmitInput | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const plan = raw.plan as IncomingPlan;
  if (!isUuid(raw.operation_key) || !isHash(raw.package_hash) || !plan || !Number.isSafeInteger(plan.id) || !Array.isArray(plan.points) || !Object.prototype.hasOwnProperty.call(raw, "package_payload")) return null;
  return { operation_key: raw.operation_key, package_hash: raw.package_hash.toLowerCase(), plan, package_payload: raw.package_payload };
}

function mapReceipt(row: any): FinishedPlanReceipt { return { operation_key: row.operation_key, planId: Number(row.plan_id), package_hash: row.package_hash, payload_hash: row.payload_hash, accepted_at: row.accepted_at ? new Date(row.accepted_at).toISOString() : undefined }; }
async function ownedClaim(client: PoolClient, planID: number, subject: string): Promise<boolean> {
  const row = (await client.query(`SELECT owner_subject, expires_at FROM lis.flightplan_claims WHERE plan_id = $1 FOR UPDATE`, [planID])).rows[0];
  return !!row && row.owner_subject === subject && new Date(row.expires_at).getTime() > Date.now();
}

export type FinishedPlanSubmitResult =
  | { kind: "confirmed"; receipt: FinishedPlanReceipt }
  | { kind: "not_found" | "forbidden" | "unclaimed" | "not_prepared" | "conflict" | "schema_required" };

/**
 * The receipt row, not merely the transaction, makes a lost HTTP response
 * readable on retry. A plan row lock serializes concurrent submissions for a
 * single plan before legacy writes run.
 */
export async function submitFinishedPlanIdempotently(input: FinishedPlanSubmitInput, principal: PlanPrincipal, db: Pick<Pool, "connect"> = pool): Promise<FinishedPlanSubmitResult> {
  const client = await db.connect();
  try {
    const payloadHash = finishedPlanPayloadHash(input);
    await client.query("BEGIN");
    const planRow = (await client.query(`SELECT id, regio_id, status FROM lis.flightPlans WHERE id = $1 FOR UPDATE`, [input.plan.id])).rows[0];
    if (!planRow) { await client.query("ROLLBACK"); return { kind: "not_found" }; }
    if (!hasPlanRegionAccess(principal, planRow.regio_id)) { await client.query("ROLLBACK"); return { kind: "forbidden" }; }
    const existing = (await client.query(`SELECT * FROM lis.ios_finished_plan_receipts WHERE operation_key = $1 FOR UPDATE`, [input.operation_key])).rows[0] as ReceiptRow | undefined;
    if (existing) {
      const same = existing.owner_subject === principal.subject && Number(existing.plan_id) === input.plan.id && existing.package_hash === input.package_hash && existing.payload_hash === payloadHash;
      await client.query("COMMIT");
      return same ? { kind: "confirmed", receipt: mapReceipt(existing) } : { kind: "conflict" };
    }
    if (!(await ownedClaim(client, input.plan.id, principal.subject))) { await client.query("ROLLBACK"); return { kind: "unclaimed" }; }
    if (planRow.status !== "prepared") { await client.query("ROLLBACK"); return { kind: "not_prepared" }; }
    // user_id remains intentionally untouched: Keycloak subject v2 is not a
    // numeric LIS user. New point writes need their own verified server mapping.
    if (input.plan.points.some(point => point.id < 0)) { await client.query("ROLLBACK"); return { kind: "conflict" }; }
    await saveFinishedPlanInTransaction(client, input.plan);
    const inserted = (await client.query(
      `INSERT INTO lis.ios_finished_plan_receipts (operation_key, owner_subject, plan_id, package_hash, payload_hash, package_payload)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb) RETURNING *`,
      [input.operation_key, principal.subject, input.plan.id, input.package_hash, payloadHash, JSON.stringify(input.package_payload)]
    )).rows[0];
    await client.query("COMMIT");
    return { kind: "confirmed", receipt: mapReceipt(inserted) };
  } catch (error: any) {
    try { await client.query("ROLLBACK"); } catch { /* preserve original error */ }
    if (error?.code === "42P01") return { kind: "schema_required" };
    throw error;
  } finally { client.release(); }
}

export async function readFinishedPlanReceipt(operationKey: string, principal: PlanPrincipal, db: Pick<Pool, "query"> = pool): Promise<FinishedPlanReceipt | null> {
  const result = await db.query(`SELECT r.* FROM lis.ios_finished_plan_receipts r
    JOIN lis.flightPlans fp ON fp.id = r.plan_id
    WHERE r.operation_key = $1 AND r.owner_subject = $2 AND (fp.regio_id = $3 OR $4::boolean)`,
    [operationKey, principal.subject, principal.regio_id, principal.is_admin]);
  return result.rows[0] ? mapReceipt(result.rows[0]) : null;
}
