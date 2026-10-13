import type { Pool, PoolClient } from "pg";
import { saveFinishedPlanInTransaction } from "../../helpers/finished-plans/createFinishedPlanDb";
import { type IncomingPlan } from "../../helpers/validators/finishedPlan";
import type { PlanPrincipal } from "../flightPlans/planAccess";
import { hasPlanRegionAccess } from "../flightPlans/planAccess";
import { digest, canonical, RecoverySigner, recoverySigner, validOperationKey } from "../iosRecovery";
import { ATTACHMENT_LAYER } from "../arcgis/iosArcgisPhotoProvider";

export type FinishedPlanSubmitInput = { operation_key: string; package_hash: string; plan: IncomingPlan; package_payload: unknown };
export type FinishedPlanReceipt = { operation_key: string; planId: number; package_hash: string; payload_hash: string; provenance: "direct_commit" | "state_verified" };
export type FinishedPlanSubmitResult = { kind: "confirmed"; receipt: FinishedPlanReceipt } | { kind: "not_found" | "forbidden" | "not_prepared" | "conflict" | "pending" };
export function finishedPlanPayloadHash(input: Pick<FinishedPlanSubmitInput, "package_hash" | "plan" | "package_payload">): string {
  return digest({ package_hash: input.package_hash.toLowerCase(), plan: input.plan, package_payload: input.package_payload });
}
export function validateFinishedPlanSubmitInput(value: unknown): FinishedPlanSubmitInput | null {
  const r = value as FinishedPlanSubmitInput;
  if (!r || !validOperationKey(r.operation_key) || !/^[a-f0-9]{64}$/.test(r.package_hash) ||
    !r.plan || !Number.isSafeInteger(r.plan.id) || r.plan.id <= 0 || !Array.isArray(r.plan.points) || !Object.prototype.hasOwnProperty.call(r, "package_payload") ||
    r.plan.points.some(p => !Number.isSafeInteger(p.id) || p.id <= 0 || typeof p.omschrijving !== "string" || !Number.isInteger(p.order) ||
      (p.attachments || []).some(a => !Number.isSafeInteger(a.taken_at) || typeof a.url !== "string")) || new Set(r.plan.points.map(p => p.id)).size !== r.plan.points.length) return null;
  return r;
}
function confirmation(input: FinishedPlanSubmitInput, provenance: FinishedPlanReceipt["provenance"]): FinishedPlanSubmitResult {
  return { kind: "confirmed", receipt: { operation_key: input.operation_key, planId: input.plan.id, package_hash: input.package_hash, payload_hash: finishedPlanPayloadHash(input), provenance } };
}
function same(a: unknown, b: unknown): boolean { return canonical(a) === canonical(b); }
function parsed(value: unknown): unknown { if (typeof value !== "string") return value; try { return JSON.parse(value); } catch { return value; } }
function date(value: unknown): number | null { if (value == null) return null; const ms = new Date(value as any).getTime(); return Number.isNaN(ms) ? null : ms; }

/** Compare every ordinary persisted projection field, without selecting latest rows. */
export async function projectionMatches(client: Pick<PoolClient, "query">, plan: IncomingPlan): Promise<boolean> {
  const rows = (await client.query("SELECT f.*, p.omschrijving FROM lis.finished_plans f JOIN lis.points p ON p.id = f.point_id WHERE f.plan_id = $1", [plan.id])).rows;
  if (rows.length !== plan.points.length || new Set(rows.map(r => Number(r.point_id))).size !== rows.length) return false;
  const paths = (await client.query("SELECT path, flighttime FROM lis.finished_plans_path WHERE planid = $1", [plan.id])).rows;
  if (paths.length !== 1 || !same(parsed(paths[0].path), plan.pathData ?? null) || !same(parsed(paths[0].flighttime), plan.flightTime ?? null)) return false;
  const referenced = rows.flatMap(r => r.attachments_id || []).map(Number);
  if (new Set(referenced).size !== referenced.length) return false;
  const attachments = (await client.query("SELECT id, url, point_id, attachmentid, taken_at, location FROM lis.attachments WHERE id = ANY($1::integer[])", [referenced])).rows;
  if (attachments.length !== referenced.length) return false;
  for (const point of plan.points) {
    const row = rows.find(r => Number(r.point_id) === point.id);
    if (!row || row.omschrijving !== point.omschrijving || row.status !== "bezocht" ||
      Number(row.point_order) !== point.order || row.pointcomment !== (point.comment ?? "") || (row.spoed ?? null) !== (point.spoed ?? null) ||
      (row.emailadres ?? null) !== (point.sendToEmail ?? null) || date(row.finished_at) !== date(point.finishedAt)) return false;
    const actual = (row.attachments_id || []).map((id: number) => attachments.find(a => Number(a.id) === Number(id)));
    const expected = point.attachments || [];
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < expected.length; i++) {
      const a = actual[i], e = expected[i];
      const lat = e.lat ?? point.latitude, lon = e.long ?? point.longitude;
      const location = lat == null || lon == null ? null : String(lat) + "," + String(lon);
      if (!a || Number(a.point_id) !== point.id || a.url !== e.url || Number(a.attachmentid) !== Number(e.objectId) ||
        Number(a.taken_at) !== e.taken_at || (a.location ?? null) !== location) return false;
    }
  }
  return true;
}
function verifiedPhotos(input: FinishedPlanSubmitInput, principal: PlanPrincipal, signer: RecoverySigner): boolean {
  try {
    const seen = new Set<string>();
    for (const point of input.plan.points) for (const a of point.attachments || []) {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      const context = (a as any).recovery_context;
      if (typeof context !== "string") return false;
      const e = signer.verify(context, "photo", principal.subject);
      if (!validOperationKey(e.operation_key) || !/^[a-f0-9]{64}$/.test(e.attachment_sha256) || !Number.isInteger(e.byte_count) || e.byte_count <= 0 || e.byte_count > 16 * 1024 * 1024 ||
        !["image/png", "image/jpeg", "image/heic"].includes(e.mime_type) || e.plan_id !== input.plan.id || e.owner_point_id !== point.id || e.package_hash !== input.package_hash ||
        e.feature_object_id !== a.objectId || e.url !== a.url || !Number.isSafeInteger(e.attachment_id) ||
        a.url !== ATTACHMENT_LAYER + "/" + e.feature_object_id + "/attachments/" + e.attachment_id) return false;
    }
    return true;
  } catch { return false; }
}
export async function submitFinishedPlanIdempotently(input: FinishedPlanSubmitInput, principal: PlanPrincipal, db?: Pick<Pool, "connect">, readOnly = false, signer?: RecoverySigner): Promise<FinishedPlanSubmitResult> {
  db ||= require("../../db").pool;
  signer ||= recoverySigner();
  if (!validateFinishedPlanSubmitInput(input) || !verifiedPhotos(input, principal, signer)) return { kind: "conflict" };
  const client = await db!.connect();
  try {
    await client.query(readOnly ? "BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY" : "BEGIN");
    const row = (await client.query("SELECT id, regio_id, status, points FROM lis.flightPlans WHERE id = $1" + (readOnly ? "" : " FOR UPDATE"), [input.plan.id])).rows[0];
    let result: FinishedPlanSubmitResult;
    if (!row) result = { kind: "not_found" };
    else if (!hasPlanRegionAccess(principal, row.regio_id)) result = { kind: "forbidden" };
    else if (!same((row.points || []).map(Number), input.plan.points.map(p => p.id))) result = { kind: "conflict" };
    else if (row.status === "finished") result = await projectionMatches(client, input.plan) ? confirmation(input, "state_verified") : { kind: "conflict" };
    else if (readOnly) result = { kind: "pending" };
    else if (row.status !== "prepared") result = { kind: "not_prepared" };
    else {
      // Existing ambiguous prior rows cannot be overwritten or appended to.
      const old = await client.query("SELECT point_id FROM lis.finished_plans WHERE plan_id = $1", [input.plan.id]);
      const oldPaths = await client.query("SELECT planid FROM lis.finished_plans_path WHERE planid = $1", [input.plan.id]);
      if (old.rows.length || oldPaths.rows.length) result = { kind: "conflict" };
      else { await saveFinishedPlanInTransaction(client, input.plan); result = confirmation(input, "direct_commit"); }
    }
    await client.query("COMMIT");
    return result;
  } catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; }
  finally { client.release(); }
}
// Operation key alone cannot identify any persistent receipt in this contract.
export async function readFinishedPlanReceipt(_key: string, _principal: PlanPrincipal): Promise<FinishedPlanReceipt | null> { return null; }
