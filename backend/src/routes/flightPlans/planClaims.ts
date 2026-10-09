import type { Pool, PoolClient, QueryResultRow } from "pg";
import type { PlanPrincipal } from "./planAccess";

export const CLAIM_TIMEOUT_SECONDS = 20 * 60;

type PlanRow = { id: number; regio_id: string | null; status: string };
type ClaimRow = { plan_id: number; owner_subject: string; claim_version: number; expires_at: string | Date };

export type PlanClaimReadback = {
  plan_id: number;
  status: string;
  claim: { state: "available" | "owned" | "claimed"; claim_version?: number; expires_at?: string };
};

function expired(expiresAt: string | Date, now: Date): boolean {
  return new Date(expiresAt).getTime() <= now.getTime();
}

function iso(expiresAt: string | Date): string { return new Date(expiresAt).toISOString(); }

export async function readPlanClaim(
  db: Pick<Pool, "query">,
  planID: string | number,
  principal: PlanPrincipal,
  now = new Date()
): Promise<{ plan: PlanRow | null; claim: PlanClaimReadback["claim"] }> {
  const plan = (await db.query<PlanRow>("SELECT id, regio_id, status FROM lis.flightPlans WHERE id = $1", [planID])).rows[0] ?? null;
  if (!plan) return { plan: null, claim: { state: "available" } };
  const row = (await db.query<ClaimRow>("SELECT plan_id, owner_subject, claim_version, expires_at FROM lis.flightplan_claims WHERE plan_id = $1", [planID])).rows[0];
  if (!row || expired(row.expires_at, now)) return { plan, claim: { state: "available" } };
  if (row.owner_subject === principal.subject) {
    return { plan, claim: { state: "owned", claim_version: row.claim_version, expires_at: iso(row.expires_at) } };
  }
  return { plan, claim: { state: "claimed", expires_at: iso(row.expires_at) } };
}

/**
 * A durable, subject-owned claim. The claim table is deliberately required
 * rather than created at request time: runtime DDL would be an unaudited
 * remote schema mutation. A supplied migration must create:
 * lis.flightplan_claims(plan_id PK, owner_subject, claim_version, claimed_at,
 * expires_at), with plan_id referencing lis.flightPlans(id).
 */
export async function claimPreparedPlan(input: {
  pool: Pick<Pool, "connect">;
  planID: string | number;
  principal: PlanPrincipal;
  now?: Date;
}): Promise<{ kind: "missing" | "unavailable" | "conflict" | "claimed"; plan?: PlanRow; claim?: PlanClaimReadback["claim"] }> {
  const now = input.now ?? new Date();
  const client = await input.pool.connect();
  try {
    await client.query("BEGIN");
    const plan = (await client.query<PlanRow>("SELECT id, regio_id, status FROM lis.flightPlans WHERE id = $1 FOR UPDATE", [input.planID])).rows[0];
    if (!plan) { await client.query("ROLLBACK"); return { kind: "missing" }; }
    if (plan.status !== "prepared") { await client.query("ROLLBACK"); return { kind: "unavailable", plan }; }
    const claim = (await client.query<ClaimRow>("SELECT plan_id, owner_subject, claim_version, expires_at FROM lis.flightplan_claims WHERE plan_id = $1 FOR UPDATE", [input.planID])).rows[0];
    if (claim && !expired(claim.expires_at, now) && claim.owner_subject !== input.principal.subject) {
      await client.query("ROLLBACK");
      return { kind: "conflict", plan, claim: { state: "claimed", expires_at: iso(claim.expires_at) } };
    }
    const nextVersion = (claim?.claim_version ?? 0) + 1;
    const expiry = new Date(now.getTime() + CLAIM_TIMEOUT_SECONDS * 1000);
    await client.query(
      `INSERT INTO lis.flightplan_claims (plan_id, owner_subject, claim_version, claimed_at, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (plan_id) DO UPDATE SET owner_subject = EXCLUDED.owner_subject,
         claim_version = EXCLUDED.claim_version, claimed_at = EXCLUDED.claimed_at, expires_at = EXCLUDED.expires_at`,
      [plan.id, input.principal.subject, nextVersion, now, expiry]
    );
    await client.query("COMMIT");
    return { kind: "claimed", plan, claim: { state: "owned", claim_version: nextVersion, expires_at: expiry.toISOString() } };
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* preserve original database error */ }
    throw error;
  } finally { client.release(); }
}

export async function requireOwnedClaimForStatus(input: {
  db: Pick<Pool, "query">;
  planID: string | number;
  principal: PlanPrincipal;
  now?: Date;
}): Promise<"missing" | "unclaimed" | "conflict" | "owned"> {
  const readback = await readPlanClaim(input.db, input.planID, input.principal, input.now);
  if (!readback.plan) return "missing";
  if (readback.claim.state === "available") return "unclaimed";
  return readback.claim.state === "owned" ? "owned" : "conflict";
}
