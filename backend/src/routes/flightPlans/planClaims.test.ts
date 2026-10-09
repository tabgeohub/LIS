import assert from "node:assert/strict";
import test from "node:test";
import { hasPlanRegionAccess } from "./planAccess";
import { claimPreparedPlan, readPlanClaim } from "./planClaims";

const regional = { subject: "regional-a", regio_id: "RWS TEST", is_admin: false };
const otherRegion = { subject: "regional-b", regio_id: "RWS OTHER", is_admin: false };
const admin = { subject: "admin-a", regio_id: "admin", is_admin: true };

test("regional access cannot widen to another plan region while admin can", () => {
  assert.equal(hasPlanRegionAccess(regional, "RWS TEST"), true);
  assert.equal(hasPlanRegionAccess(regional, "RWS OTHER"), false);
  assert.equal(hasPlanRegionAccess(admin, "RWS OTHER"), true);
});

test("a durable claim conflicts across subjects and timeout readback becomes available", async () => {
  const state: { claim?: { plan_id: number; owner_subject: string; claim_version: number; expires_at: Date }; plan: { id: number; regio_id: string; status: string } } = {
    plan: { id: 7, regio_id: "RWS TEST", status: "prepared" },
  };
  const query = async (sql: string, params: unknown[] = []) => {
    if (sql.includes("FROM lis.flightPlans") && sql.includes("FOR UPDATE")) return { rows: [state.plan] };
    if (sql.includes("FROM lis.flightPlans")) return { rows: [state.plan] };
    if (sql.includes("FROM lis.flightplan_claims")) return { rows: state.claim ? [state.claim] : [] };
    if (sql.includes("INSERT INTO lis.flightplan_claims")) {
      state.claim = { plan_id: Number(params[0]), owner_subject: String(params[1]), claim_version: Number(params[2]), expires_at: params[4] as Date };
    }
    return { rows: [] };
  };
  const pool = { connect: async () => ({ query, release() {} }), query } as any;
  const now = new Date("2026-10-09T12:00:00Z");
  const first = await claimPreparedPlan({ pool, planID: 7, principal: regional, now });
  assert.equal(first.kind, "claimed");
  const concurrent = await Promise.all([
    claimPreparedPlan({ pool, planID: 7, principal: otherRegion, now }),
    claimPreparedPlan({ pool, planID: 7, principal: otherRegion, now }),
  ]);
  assert.deepEqual(concurrent.map((result) => result.kind), ["conflict", "conflict"]);
  const readback = await readPlanClaim(pool, 7, regional, now);
  assert.equal(readback.claim.state, "owned");
  const expired = await readPlanClaim(pool, 7, regional, new Date("2026-10-09T12:21:00Z"));
  assert.equal(expired.claim.state, "available");
});

test("missing and non-prepared plans are never claimed", async () => {
  const absentPool = { connect: async () => ({ query: async () => ({ rows: [] }), release() {} }) } as any;
  assert.equal((await claimPreparedPlan({ pool: absentPool, planID: 99, principal: regional })).kind, "missing");
  const donePool = { connect: async () => ({ query: async (sql: string) => ({ rows: sql.includes("flightPlans") ? [{ id: 9, regio_id: "RWS TEST", status: "finished" }] : [] }), release() {} }) } as any;
  assert.equal((await claimPreparedPlan({ pool: donePool, planID: 9, principal: regional })).kind, "unavailable");
});
