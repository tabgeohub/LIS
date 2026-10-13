import crypto from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { pool } from "../../db";
import type { PlanPrincipal } from "../flightPlans/planAccess";

export type PhotoOutcome = "pending" | "confirmed" | "not_created" | "uncertain";
export type PhotoReceipt = {
  feature_object_id: number;
  attachment_id: number;
  url: string;
  evidence: Record<string, unknown>;
};
export type PhotoOperationInput = {
  operation_key: string;
  package_hash: string;
  local_attachment_id: string;
  owner_point_id: number;
  plan_id: number;
  attachment_sha256: string;
  bytes: Buffer;
  mime_type: string;
};

type StoredOperation = {
  operation_key: string;
  owner_subject: string;
  plan_id: number;
  owner_point_id: number;
  package_hash: string;
  local_attachment_id: string;
  payload_hash: string;
  outcome: PhotoOutcome;
  feature_object_id: number | null;
  provider_attachment_id: number | null;
  remote_url: string | null;
  provider_evidence: Record<string, unknown>;
};

export type ProviderReadback =
  | { outcome: "confirmed"; receipt: PhotoReceipt }
  | { outcome: "not_created"; evidence: Record<string, unknown> }
  | { outcome: "uncertain"; evidence: Record<string, unknown> };

/**
 * ArcGIS does not expose a generic idempotency key or attachment readback
 * guarantee. A real adapter may be installed only after the owning feature
 * layer proves a stable, queryable operation marker. The default intentionally
 * performs no write; it is safer than replaying an unidentifiable create.
 */
export interface ArcgisPhotoProvider {
  readback(input: PhotoOperationInput): Promise<ProviderReadback>;
  create(input: PhotoOperationInput): Promise<ProviderReadback>;
}

const unavailableProvider: ArcgisPhotoProvider = {
  async readback() {
    return { outcome: "uncertain", evidence: { kind: "provider_readback_unconfigured" } };
  },
  async create() {
    return { outcome: "uncertain", evidence: { kind: "provider_create_unconfigured" } };
  },
};

let provider: ArcgisPhotoProvider = unavailableProvider;
/** Test-only seam; production remains explicitly unconfigured until provider evidence is verified. */
export function setArcgisPhotoProviderForTests(next: ArcgisPhotoProvider | null): void {
  provider = next ?? unavailableProvider;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function isHash(value: string): boolean { return /^[a-f0-9]{64}$/i.test(value); }

export function validatePhotoOperationInput(value: unknown, bytes: Buffer | undefined): PhotoOperationInput | null {
  if (!value || typeof value !== "object" || !bytes || bytes.length === 0) return null;
  const raw = value as Record<string, unknown>;
  const operation_key = typeof raw.operation_key === "string" ? raw.operation_key : "";
  const package_hash = typeof raw.package_hash === "string" ? raw.package_hash : "";
  const local_attachment_id = typeof raw.local_attachment_id === "string" ? raw.local_attachment_id : "";
  const attachment_sha256 = typeof raw.attachment_sha256 === "string" ? raw.attachment_sha256 : "";
  const owner_point_id = Number(raw.owner_point_id);
  const plan_id = Number(raw.plan_id);
  const mime_type = typeof raw.mime_type === "string" ? raw.mime_type : "";
  if (!isUuid(operation_key) || !isHash(package_hash) || !isHash(attachment_sha256) || !local_attachment_id ||
      !Number.isSafeInteger(owner_point_id) || !Number.isSafeInteger(plan_id) ||
      !["image/jpeg", "image/png", "image/heic"].includes(mime_type) ||
      crypto.createHash("sha256").update(bytes).digest("hex") !== attachment_sha256.toLowerCase()) return null;
  return { operation_key, package_hash: package_hash.toLowerCase(), local_attachment_id, owner_point_id, plan_id,
    attachment_sha256: attachment_sha256.toLowerCase(), bytes, mime_type };
}

function payloadHash(input: PhotoOperationInput): string {
  return crypto.createHash("sha256").update(JSON.stringify({ package_hash: input.package_hash,
    local_attachment_id: input.local_attachment_id, owner_point_id: input.owner_point_id,
    plan_id: input.plan_id, attachment_sha256: input.attachment_sha256, mime_type: input.mime_type })).digest("hex");
}
function receipt(row: StoredOperation): PhotoReceipt | null {
  if (row.outcome !== "confirmed" || row.feature_object_id == null || row.provider_attachment_id == null || !row.remote_url) return null;
  return { feature_object_id: row.feature_object_id, attachment_id: row.provider_attachment_id, url: row.remote_url, evidence: row.provider_evidence };
}
function asStored(row: any): StoredOperation { return { ...row, provider_evidence: row.provider_evidence || {} }; }

async function authorizedPoint(client: PoolClient, input: PhotoOperationInput, principal: PlanPrincipal): Promise<boolean> {
  const result = await client.query(
    `SELECT fp.id FROM lis.flightPlans fp
       JOIN unnest(COALESCE(fp.points, ARRAY[]::integer[])) AS listed_point(point_id) ON listed_point.point_id = $2
      WHERE fp.id = $1 AND (fp.regio_id = $3 OR $4::boolean)`,
    [input.plan_id, input.owner_point_id, principal.regio_id, principal.is_admin]
  );
  return result.rowCount === 1;
}

async function readStored(client: PoolClient, key: string): Promise<StoredOperation | null> {
  const result = await client.query("SELECT * FROM lis.ios_photo_operations WHERE operation_key = $1 FOR UPDATE", [key]);
  return result.rows[0] ? asStored(result.rows[0]) : null;
}

async function persistOutcome(client: PoolClient, input: PhotoOperationInput, principal: PlanPrincipal, outcome: ProviderReadback): Promise<StoredOperation> {
  const confirmed = outcome.outcome === "confirmed" ? outcome.receipt : null;
  const evidence = outcome.outcome === "confirmed" ? outcome.receipt.evidence : outcome.evidence;
  const result = await client.query(
    `UPDATE lis.ios_photo_operations
        SET outcome = $2, feature_object_id = $3, provider_attachment_id = $4, remote_url = $5,
            provider_evidence = $6::jsonb, updated_at = now()
      WHERE operation_key = $1
      RETURNING *`,
    [input.operation_key, outcome.outcome, confirmed?.feature_object_id ?? null, confirmed?.attachment_id ?? null,
      confirmed?.url ?? null, JSON.stringify(evidence)]
  );
  return asStored(result.rows[0]);
}

export type PhotoOperationResult = { httpStatus: number; outcome: PhotoOutcome; receipt?: PhotoReceipt; code?: string };

/** Persists provider evidence before returning it; response loss can then be read back safely. */
export async function reconcileOrCreatePhoto(input: PhotoOperationInput, principal: PlanPrincipal, db: Pick<Pool, "connect"> = pool): Promise<PhotoOperationResult> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    if (!(await authorizedPoint(client, input, principal))) { await client.query("ROLLBACK"); return { httpStatus: 403, outcome: "uncertain", code: "PHOTO_OWNER_FORBIDDEN" }; }
    const existing = await readStored(client, input.operation_key);
    const expectedHash = payloadHash(input);
    if (existing) {
      if (existing.owner_subject !== principal.subject || existing.payload_hash !== expectedHash || existing.plan_id !== input.plan_id) {
        await client.query("ROLLBACK"); return { httpStatus: 409, outcome: "uncertain", code: "PHOTO_OPERATION_KEY_CONFLICT" };
      }
      if (existing.outcome === "confirmed") { await client.query("COMMIT"); return { httpStatus: 200, outcome: "confirmed", receipt: receipt(existing)! }; }
      await client.query("COMMIT");
    } else {
      await client.query(
        `INSERT INTO lis.ios_photo_operations (operation_key, owner_subject, plan_id, owner_point_id, package_hash, local_attachment_id, payload_hash, outcome, provider_evidence)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'pending','{}'::jsonb)`,
        [input.operation_key, principal.subject, input.plan_id, input.owner_point_id, input.package_hash, input.local_attachment_id, expectedHash]
      );
      await client.query("COMMIT");
    }

    // A retry always asks the provider for evidence before any create. Generic
    // ArcGIS support cannot prove this, so the default stops as uncertain.
    const before = await provider.readback(input);
    const outcome = before.outcome === "not_created" ? await provider.create(input) : before;
    await client.query("BEGIN");
    const stored = await readStored(client, input.operation_key);
    if (!stored || stored.owner_subject !== principal.subject) throw new Error("photo operation disappeared");
    const persisted = await persistOutcome(client, input, principal, outcome);
    await client.query("COMMIT");
    return persisted.outcome === "confirmed"
      ? { httpStatus: 200, outcome: "confirmed", receipt: receipt(persisted)! }
      : { httpStatus: 202, outcome: persisted.outcome, code: persisted.outcome === "uncertain" ? "PHOTO_OPERATION_UNCERTAIN" : undefined };
  } catch (error: any) {
    try { await client.query("ROLLBACK"); } catch { /* preserve original error */ }
    if (error?.code === "42P01") return { httpStatus: 503, outcome: "uncertain", code: "PHOTO_OPERATION_SCHEMA_REQUIRED" };
    throw error;
  } finally { client.release(); }
}

export async function readPhotoOperation(operationKey: string, principal: PlanPrincipal, db: Pick<Pool, "query"> = pool): Promise<PhotoOperationResult | null> {
  const result = await db.query(`SELECT operation.* FROM lis.ios_photo_operations operation
    JOIN lis.flightPlans fp ON fp.id = operation.plan_id
    WHERE operation.operation_key = $1 AND operation.owner_subject = $2
      AND (fp.regio_id = $3 OR $4::boolean)`, [operationKey, principal.subject, principal.regio_id, principal.is_admin]);
  const row = result.rows[0] ? asStored(result.rows[0]) : null;
  if (!row) return null;
  return row.outcome === "confirmed" ? { httpStatus: 200, outcome: "confirmed", receipt: receipt(row)! } : { httpStatus: 202, outcome: row.outcome };
}
