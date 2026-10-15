import type { Pool, PoolClient } from "pg";
import { saveFinishedPlanInTransaction } from "../../helpers/finished-plans/createFinishedPlanDb";
import { type IncomingPlan } from "../../helpers/validators/finishedPlan";
import type { PlanPrincipal } from "../flightPlans/planAccess";
import { hasPlanRegionAccess } from "../flightPlans/planAccess";
import { digest, canonical, RecoverySigner, recoverySigner, validOperationKey } from "../iosRecovery";
import { ATTACHMENT_LAYER } from "../arcgis/iosArcgisPhotoProvider";

export type FinishedPlanSubmitInput = { operation_key: string; package_hash: string; plan: IncomingPlan; package_payload: unknown };
export type FinishedPlanReceipt = { operation_key: string; planId: number; package_hash: string; payload_hash: string; provenance: "direct_commit" | "state_verified"; point_id_map?: Record<string, number> };
export type FinishedPlanSubmitResult = { kind: "confirmed"; receipt: FinishedPlanReceipt } | { kind: "not_found" | "forbidden" | "not_prepared" | "conflict" | "pending" | "recovery_eligible" };
export function finishedPlanPayloadHash(input: Pick<FinishedPlanSubmitInput, "package_hash" | "plan" | "package_payload">): string {
  return digest({ package_hash: input.package_hash.toLowerCase(), plan: input.plan, package_payload: input.package_payload });
}
export function validateFinishedPlanSubmitInput(value: unknown): FinishedPlanSubmitInput | null {
  const r = value as FinishedPlanSubmitInput;
  if (!r || !validOperationKey(r.operation_key) || !/^[a-f0-9]{64}$/.test(r.package_hash) ||
    !r.plan || !Number.isSafeInteger(r.plan.id) || r.plan.id <= 0 || !Array.isArray(r.plan.points) || !Object.prototype.hasOwnProperty.call(r, "package_payload") ||
    r.plan.points.some(p => !Number.isSafeInteger(p.id) || p.id === 0 || typeof p.omschrijving !== "string" || !Number.isInteger(p.order) ||
      (p.attachments || []).some(a => !Number.isSafeInteger(a.taken_at) || typeof a.url !== "string")) || new Set(r.plan.points.map(p => p.id)).size !== r.plan.points.length) return null;
  for (const point of r.plan.points.filter(point => point.id < 0)) {
    if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude) ||
      point.latitude! < -90 || point.latitude! > 90 || point.longitude! < -180 || point.longitude! > 180) return null;
  }
  return r;
}
function confirmation(input: FinishedPlanSubmitInput, provenance: FinishedPlanReceipt["provenance"], pointIDMap: Record<number, number> = {}): FinishedPlanSubmitResult {
  const point_id_map = Object.fromEntries(Object.entries(pointIDMap).map(([key, value]) => [key, value]));
  return { kind: "confirmed", receipt: { operation_key: input.operation_key, planId: input.plan.id, package_hash: input.package_hash, payload_hash: finishedPlanPayloadHash(input), provenance, ...(Object.keys(point_id_map).length ? { point_id_map } : {}) } };
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
/** Resolve package-local negative IDs only from the committed ordered projection.
 * This is deliberately conservative: any mismatch leaves recovery pending. */
async function persistedPointMap(client: Pick<PoolClient, "query">, plan: IncomingPlan): Promise<Record<number, number> | null> {
  const rows = (await client.query("SELECT f.point_id, f.point_order, p.omschrijving FROM lis.finished_plans f JOIN lis.points p ON p.id = f.point_id WHERE f.plan_id = $1 ORDER BY f.point_order, f.point_id", [plan.id])).rows;
  if (rows.length !== plan.points.length) return null;
  const map: Record<number, number> = {};
  for (let i = 0; i < plan.points.length; i++) {
    const expected = plan.points[i], actual = rows[i];
    if (!actual || Number(actual.point_order) !== expected.order || actual.omschrijving !== expected.omschrijving) return null;
    const id = Number(actual.point_id);
    if (expected.id > 0 && id !== expected.id) return null;
    if (expected.id < 0) map[expected.id] = id;
  }
  return map;
}
function withMappedPointIDs(plan: IncomingPlan, pointIDMap: Record<number, number>): IncomingPlan {
  return { ...plan, points: plan.points.map(point => point.id < 0 ? { ...point, id: pointIDMap[point.id] } : point) };
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
/**
 * An attachment can have been registered by a partial older write even when
 * the plan/path rows are absent.  Do not attach it again: the existing schema
 * cannot prove that it belongs to this frozen completion without a finished
 * plan projection.  Only exact remote identities block recovery; unrelated
 * historical attachments on the same point remain valid.
 */
async function hasExpectedAttachmentRegistration(client: Pick<PoolClient, "query">, input: FinishedPlanSubmitInput): Promise<boolean> {
  const expected = input.plan.points.flatMap(point => (point.attachments || []).map(attachment => ({ url: attachment.url, objectId: Number(attachment.objectId) })));
  if (!expected.length) return false;
  const rows = (await client.query(
    "SELECT url, attachmentid FROM lis.attachments WHERE url = ANY($1::text[]) OR attachmentid = ANY($2::integer[])",
    [expected.map(value => value.url), expected.map(value => value.objectId)]
  )).rows;
  return rows.some(row => expected.some(value => row.url === value.url || Number(row.attachmentid) === value.objectId));
}
export async function submitFinishedPlanIdempotently(input: FinishedPlanSubmitInput, principal: PlanPrincipal, db?: Pick<Pool, "connect">, readOnly = false, signer?: RecoverySigner): Promise<FinishedPlanSubmitResult> {
  db ||= require("../../db").pool;
  signer ||= recoverySigner();
  if (!validateFinishedPlanSubmitInput(input) || !verifiedPhotos(input, principal, signer)) return { kind: "conflict" };
  const client = await db!.connect();
  try {
    await client.query(readOnly ? "BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY" : "BEGIN");
    const row = (await client.query("SELECT id, regio_id, user_id, status, points FROM lis.flightPlans WHERE id = $1" + (readOnly ? "" : " FOR UPDATE"), [input.plan.id])).rows[0];
    let result: FinishedPlanSubmitResult;
    if (!row) result = { kind: "not_found" };
    else if (!hasPlanRegionAccess(principal, row.regio_id)) result = { kind: "forbidden" };
    else if (!same((row.points || []).map(Number), input.plan.points.filter(p => p.id > 0).map(p => p.id))) result = { kind: "conflict" };
    else if (row.status === "finished") {
      const pointIDMap = await persistedPointMap(client, input.plan);
      const persisted = pointIDMap ? withMappedPointIDs(input.plan, pointIDMap) : input.plan;
      result = pointIDMap !== null && await projectionMatches(client, persisted) ? confirmation(input, "state_verified", pointIDMap) : { kind: "conflict" };
    }
    else if (row.status !== "prepared" && row.status !== "in-progress") result = { kind: "not_prepared" };
    else {
      // Existing ambiguous prior rows cannot be overwritten or appended to.
      const old = await client.query("SELECT point_id FROM lis.finished_plans WHERE plan_id = $1", [input.plan.id]);
      const oldPaths = await client.query("SELECT planid FROM lis.finished_plans_path WHERE planid = $1", [input.plan.id]);
      const hasExpectedAttachment = await hasExpectedAttachmentRegistration(client, input);
      if (old.rows.length || oldPaths.rows.length || hasExpectedAttachment) result = { kind: "conflict" };
      else if (readOnly) result = { kind: "recovery_eligible" };
      else {
        const pointIDMap = await saveFinishedPlanInTransaction(client, { ...input.plan, user_id: row.user_id }, {
          allowMissingFinishedAt: true,
        });
        result = confirmation(input, "direct_commit", pointIDMap);
      }
    }
    await client.query("COMMIT");
    return result;
  } catch (error) { try { await client.query("ROLLBACK"); } catch {} throw error; }
  finally { client.release(); }
}
// Operation key alone cannot identify any persistent receipt in this contract.
export async function readFinishedPlanReceipt(_key: string, _principal: PlanPrincipal): Promise<FinishedPlanReceipt | null> { return null; }
