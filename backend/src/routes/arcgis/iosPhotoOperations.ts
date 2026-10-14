import crypto from "node:crypto";
import type { Pool } from "pg";
import type { PlanPrincipal } from "../flightPlans/planAccess";
import { digest, RecoverySigner, recoverySigner } from "../iosRecovery";
import { WritePermits } from "../iosWritePermit";
import { uploadDiagnostic } from "../iosUploadDiagnostics";

export const MAX_PHOTO_BYTES = 16 * 1024 * 1024;
export type PhotoOutcome = "pending" | "confirmed" | "not_created" | "uncertain";
export type PhotoReceipt = { feature_object_id: number; attachment_id: number; url: string; evidence: Record<string, unknown>; recovery_context?: string };
export type PhotoOperationInput = { operation_key: string; package_hash: string; local_attachment_id: string; owner_point_id: number; plan_id: number; attachment_sha256: string; mime_type: string; byte_count: number; phase: "prepare" | "feature" | "attachment"; recovery_context?: string; write_permit?: string; bytes?: Buffer };
export type PhotoOperationResult = { httpStatus: number; outcome: PhotoOutcome; receipt?: PhotoReceipt; feature_object_id?: number; recovery_context?: string; write_permit?: string; code?: string; diagnostic?: ReturnType<typeof uploadDiagnostic> };
export interface ArcgisPhotoProvider {
  createFeature(): Promise<number>;
  addAttachment(featureID: number, input: PhotoOperationInput): Promise<number>;
  read(featureID: number, attachmentID: number | undefined, input: PhotoOperationInput): Promise<PhotoReceipt | null>;
}
let injected: ArcgisPhotoProvider | undefined;
export function setArcgisPhotoProviderForTests(value: ArcgisPhotoProvider | null): void { injected = value || undefined; }
async function provider(): Promise<ArcgisPhotoProvider> { return injected || require("./iosArcgisPhotoProvider").arcgisPhotoProvider; }
async function database(): Promise<Pick<Pool, "query">> { return require("../../db").pool; }
export function validatePhotoOperationInput(value: unknown, bytes?: Buffer): PhotoOperationInput | null {
  const r = value as PhotoOperationInput;
  if (!r || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(r.operation_key) || !/^[a-f0-9]{64}$/.test(r.package_hash) || !/^[a-f0-9]{64}$/.test(r.attachment_sha256) ||
    typeof r.local_attachment_id !== "string" || !r.local_attachment_id || r.local_attachment_id.length > 200 ||
    !Number.isSafeInteger(r.plan_id) || r.plan_id <= 0 || !Number.isSafeInteger(r.owner_point_id) || r.owner_point_id <= 0 ||
    !Number.isInteger(r.byte_count) || r.byte_count <= 0 || r.byte_count > MAX_PHOTO_BYTES || !["prepare", "feature", "attachment"].includes(r.phase) ||
    !["image/png", "image/jpeg", "image/heic"].includes(r.mime_type)) return null;
  if (r.phase === "attachment" && (!bytes || bytes.length !== r.byte_count || !matchesImage(bytes, r.mime_type) ||
    crypto.createHash("sha256").update(bytes).digest("hex") !== r.attachment_sha256 || typeof r.recovery_context !== "string")) return null;
  return { ...r, bytes };
}
export function matchesImage(bytes: Buffer, mime: string): boolean {
  if (mime === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (mime === "image/jpeg") return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  return bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp" && ["heic", "heix", "hevc", "hevx", "mif1"].includes(bytes.toString("ascii", 8, 12));
}
export function photoBinding(input: PhotoOperationInput): Record<string, unknown> {
  const { operation_key, package_hash, local_attachment_id, owner_point_id, plan_id, attachment_sha256, mime_type, byte_count } = input;
  return { operation_key, package_hash, local_attachment_id, owner_point_id, plan_id, attachment_sha256, mime_type, byte_count };
}
async function authorized(input: PhotoOperationInput, principal: PlanPrincipal, db: Pick<Pool, "query">): Promise<boolean> {
  return ((await db.query("SELECT id FROM lis.flightPlans WHERE id = $1 AND $2 = ANY(points) AND (regio_id = $3 OR $4::boolean)",
    [input.plan_id, input.owner_point_id, principal.regio_id, principal.is_admin])).rowCount || 0) === 1;
}
// Bounded process-local suppression only, NOT durable across server restarts.
const active = new Map<string, { hash: string; promise: Promise<PhotoOperationResult> }>();
const permits = new WritePermits();
export async function reconcileOrCreatePhoto(input: PhotoOperationInput, principal: PlanPrincipal, db?: Pick<Pool, "query">, adapter?: ArcgisPhotoProvider, signer?: RecoverySigner): Promise<PhotoOperationResult> {
  db ||= await database(); adapter ||= await provider(); signer ||= recoverySigner();
  if (!await authorized(input, principal, db)) return { httpStatus: 403, outcome: "not_created", code: "PHOTO_OWNER_FORBIDDEN" };
  const binding = photoBinding(input), key = principal.subject + "/" + input.operation_key + "/" + input.phase, hash = digest(binding);
  if (input.phase === "prepare") {
    try { return { httpStatus: 200, outcome: "not_created", write_permit: permits.issue(principal.subject, "feature/" + input.operation_key, hash, signer) }; }
    catch { return { httpStatus: 202, outcome: "uncertain", code: "PHOTO_WRITE_REVIEW_REQUIRED" }; }
  }
  if (input.recovery_context) {
    try { if (digest(photoBinding(signer.verify(input.recovery_context, "photo", principal.subject) as PhotoOperationInput)) !== hash) throw new Error("conflict"); }
    catch { return { httpStatus: 409, outcome: "uncertain", code: "PHOTO_RECOVERY_CONTEXT_CONFLICT" }; }
  }
  const previous = active.get(key);
  const cacheHash = digest({ binding, recovery_context: input.recovery_context ?? null });
  if (previous) return previous.hash === cacheHash ? previous.promise : { httpStatus: 409, outcome: "uncertain", code: "PHOTO_OPERATION_KEY_CONFLICT" };
  const work = async (): Promise<PhotoOperationResult> => {
    let evidence: Record<string, any> = binding;
    if (input.recovery_context) {
      try {
        evidence = signer!.verify(input.recovery_context, "photo", principal.subject);
        if (digest(photoBinding(evidence as PhotoOperationInput)) !== hash) throw new Error("conflict");
      } catch { return { httpStatus: 409, outcome: "uncertain", code: "PHOTO_RECOVERY_CONTEXT_CONFLICT" }; }
    }
    if (input.phase === "feature") {
      if (input.recovery_context) return { httpStatus: 202, outcome: "pending", feature_object_id: evidence.feature_object_id, recovery_context: input.recovery_context };
      try {
        try { permits.consume(principal.subject, "feature/" + input.operation_key, hash, input.write_permit || "", signer!); }
        catch { return { httpStatus: 202, outcome: "uncertain", code: "PHOTO_WRITE_REVIEW_REQUIRED" }; }
        const id = await adapter!.createFeature();
        if (!Number.isSafeInteger(id) || id <= 0) throw new Error("invalid feature");
        return { httpStatus: 202, outcome: "pending", feature_object_id: id, recovery_context: signer!.sign("photo", principal.subject, { ...binding, feature_object_id: id }), write_permit: permits.issue(principal.subject, "attachment/" + input.operation_key, hash, signer!) };
      } catch (error) {
        if (error instanceof Error && ["ARCGIS_PROVIDER_UNCONFIGURED", "ARCGIS_LAYER_UNSUPPORTED"].includes(error.message)) return { httpStatus: 503, outcome: "uncertain", code: "PHOTO_PROVIDER_UNCONFIGURED", diagnostic: uploadDiagnostic("photo", "PHOTO_PROVIDER_UNCONFIGURED", 503, error) };
        return { httpStatus: 202, outcome: "uncertain", code: "PHOTO_FEATURE_UNCERTAIN", diagnostic: uploadDiagnostic("photo", "PHOTO_FEATURE_UNCERTAIN", 202, error) };
      }
    }
    if (!evidence.feature_object_id) return { httpStatus: 409, outcome: "uncertain", code: "PHOTO_FEATURE_CONTEXT_REQUIRED" };
    const before = await adapter!.read(evidence.feature_object_id, evidence.attachment_id, input);
    if (before) return complete(before, binding, principal, signer!);
    if (evidence.attachment_id) return { httpStatus: 202, outcome: "uncertain", recovery_context: input.recovery_context };
    try {
      try { permits.consume(principal.subject, "attachment/" + input.operation_key, hash, input.write_permit || "", signer!); }
      catch { return { httpStatus: 202, outcome: "uncertain", recovery_context: input.recovery_context, code: "PHOTO_WRITE_REVIEW_REQUIRED" }; }
      const id = await adapter!.addAttachment(evidence.feature_object_id, input);
      const context = signer!.sign("photo", principal.subject, { ...binding, feature_object_id: evidence.feature_object_id, attachment_id: id });
      const read = await adapter!.read(evidence.feature_object_id, id, input);
      return read ? complete(read, binding, principal, signer!) : { httpStatus: 202, outcome: "uncertain", recovery_context: context, feature_object_id: evidence.feature_object_id };
    } catch (error) { return { httpStatus: 202, outcome: "uncertain", recovery_context: input.recovery_context, code: "PHOTO_ATTACHMENT_UNCERTAIN", diagnostic: uploadDiagnostic("photo", "PHOTO_ATTACHMENT_UNCERTAIN", 202, error) }; }
  };
  const promise = work(); active.set(key, { hash: cacheHash, promise });
  if (active.size > 1000) active.delete(active.keys().next().value!);
  return promise;
}
function complete(receipt: PhotoReceipt, binding: Record<string, unknown>, principal: PlanPrincipal, signer: RecoverySigner): PhotoOperationResult {
  const context = signer.sign("photo", principal.subject, { ...binding, feature_object_id: receipt.feature_object_id, attachment_id: receipt.attachment_id, url: receipt.url });
  return { httpStatus: 200, outcome: "confirmed", recovery_context: context, receipt: { ...receipt, recovery_context: context } };
}
export async function readPhotoOperation(operationKey: string, principal: PlanPrincipal, db?: Pick<Pool, "query">, context?: string, adapter?: ArcgisPhotoProvider, signer?: RecoverySigner): Promise<PhotoOperationResult> {
  if (!context) return { httpStatus: 202, outcome: "uncertain", code: "PHOTO_RECOVERY_CONTEXT_REQUIRED" };
  signer ||= recoverySigner();
  let input: PhotoOperationInput;
  try {
    input = signer.verify(context, "photo", principal.subject) as PhotoOperationInput;
    if (input.operation_key !== operationKey) throw new Error("conflict");
  } catch { return { httpStatus: 409, outcome: "uncertain", code: "PHOTO_RECOVERY_CONTEXT_CONFLICT" }; }
  if (!await authorized(input, principal, db || await database())) return { httpStatus: 403, outcome: "uncertain", code: "PHOTO_OWNER_FORBIDDEN" };
  const evidence = input as any;
  const found = await (adapter || await provider()).read(evidence.feature_object_id, evidence.attachment_id, input);
  return found ? complete(found, photoBinding(input), principal, signer) : { httpStatus: 202, outcome: "uncertain", recovery_context: context, feature_object_id: evidence.feature_object_id };
}
