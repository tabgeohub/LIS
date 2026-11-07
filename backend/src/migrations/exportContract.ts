import { createHash, createPrivateKey, createPublicKey, sign, verify } from "node:crypto";

/** JSON-only snapshot. Arrays retain persistence order; objects are canonically sorted. */
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export interface FlightMigrationExportV1 {
  version: 1;
  source: { instance: string; environment: string; issuer: string; flightId: string };
  exportId: string;
  createdAt: string;
  expiresAt: string;
  exportedBy: { subject: string; issuer: string };
  records: { flight: Json; points: Json[]; geometries: Json[]; completions: Json[]; attachments: Json[]; path: Json | null; logs: Json[] };
  counts: { points: number; geometries: number; completions: number; attachments: number; logs: number };
}
export interface SignedExport { payload: FlightMigrationExportV1; digest: string; keyId: string; signature: string }
export const MAX_EXPORT_BYTES = 64 * 1024 * 1024;

export function canonicalJson(value: Json): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("INVALID_EXPORT_NUMBER");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) throw new Error("INVALID_EXPORT_VALUE");
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
}

function encoded(payload: FlightMigrationExportV1): Buffer {
  const bytes = Buffer.from(canonicalJson(payload as unknown as Json), "utf8");
  if (bytes.length > MAX_EXPORT_BYTES) throw new Error("EXPORT_TOO_LARGE");
  return bytes;
}
function validate(payload: FlightMigrationExportV1, now: number): void {
  if (payload.version !== 1 || !payload.source?.instance || !payload.source.environment || !payload.source.issuer || !payload.source.flightId || !payload.exportId || !payload.exportedBy?.subject || !payload.exportedBy.issuer) throw new Error("INVALID_EXPORT");
  const created = Date.parse(payload.createdAt), expires = Date.parse(payload.expiresAt);
  if (!Number.isFinite(created) || !Number.isFinite(expires) || expires <= created || expires - created > 24 * 60 * 60 * 1000 || created > now || expires <= now) throw new Error("EXPORT_EXPIRED");
  for (const key of ["points", "geometries", "completions", "attachments", "logs"] as const) {
    if (!Array.isArray(payload.records?.[key]) || payload.counts?.[key] !== payload.records[key].length) throw new Error("INVALID_EXPORT_COUNTS");
  }
  if (!payload.records.flight || !("path" in payload.records)) throw new Error("INVALID_EXPORT");
  const prohibited = /(?:password|secret|access_token|refresh_token|provider_token|permit|recovery_context|cookie)/i;
  const check = (value: Json): void => {
    if (Array.isArray(value)) { value.forEach(check); return; }
    if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
      if (prohibited.test(key)) throw new Error("SENSITIVE_EXPORT_FIELD");
      check(child);
    }
  };
  check(payload.records as unknown as Json);
}
export function signExport(payload: FlightMigrationExportV1, keyId: string, privateKey: string, now = Date.now()): SignedExport {
  validate(payload, now);
  if (!keyId) throw new Error("INVALID_KEY_ID");
  const key = createPrivateKey(privateKey);
  if (key.asymmetricKeyType !== "ed25519") throw new Error("INVALID_SIGNING_KEY");
  const bytes = encoded(payload);
  const digest = createHash("sha256").update(bytes).digest("hex");
  const signature = sign(null, bytes, key).toString("base64url");
  return { payload, digest, keyId, signature };
}
export function verifyExport(envelope: SignedExport, trustedKeys: Record<string, string>, now = Date.now()): FlightMigrationExportV1 {
  if (!Object.prototype.hasOwnProperty.call(trustedKeys, envelope.keyId)) throw new Error("UNKNOWN_SIGNING_KEY");
  const bytes = encoded(envelope.payload);
  const digest = createHash("sha256").update(bytes).digest("hex");
  const key = createPublicKey(trustedKeys[envelope.keyId]);
  if (key.asymmetricKeyType !== "ed25519" || digest !== envelope.digest || !verify(null, bytes, key, Buffer.from(envelope.signature, "base64url"))) throw new Error("INVALID_EXPORT_SIGNATURE");
  validate(envelope.payload, now);
  return envelope.payload;
}
