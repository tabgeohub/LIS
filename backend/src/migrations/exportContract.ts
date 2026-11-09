import { createHash, createPublicKey, verify } from "node:crypto";

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
  for (const key of ["points", "geometries", "completions", "attachments", "logs"] as const) if (!Array.isArray(payload.records?.[key]) || payload.counts?.[key] !== payload.records[key].length) throw new Error("INVALID_EXPORT_COUNTS");
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
  validateStructure(payload);
}

function row(value: Json, error = "INVALID_EXPORT_STRUCTURE"): { [key: string]: Json } {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(error);
  return value;
}
function rowId(value: Json): string {
  const identifier = row(value).id;
  if (identifier === undefined || identifier === null || identifier === "") throw new Error("INVALID_EXPORT_STRUCTURE");
  return String(identifier);
}
function references(value: Json, key: string): Json[] {
  const result = row(value)[key];
  if (!Array.isArray(result)) throw new Error("INVALID_EXPORT_STRUCTURE");
  return result;
}
function optionalReferences(value: Json, key: string): Json[] {
  const result = row(value)[key];
  if (result === undefined || result === null) return [];
  if (!Array.isArray(result)) throw new Error("INVALID_EXPORT_STRUCTURE");
  return result;
}
/** Verify every foreign record link before an importer reaches a database. */
function validateStructure(payload: FlightMigrationExportV1): void {
  const flight = row(payload.records.flight);
  const members = references(payload.records.flight, "points").map(String);
  if (!members.length || new Set(members).size !== members.length) throw new Error("INVALID_EXPORT_STRUCTURE");
  const pointIds = new Set(payload.records.points.map(rowId));
  if (members.some(member => !pointIds.has(member))) throw new Error("INVALID_EXPORT_STRUCTURE");
  const geometryIds = new Set(payload.records.geometries.map(rowId));
  const vertices = new Set<string>();
  for (const geometry of payload.records.geometries) {
    for (const vertex of references(geometry, "vertices")) vertices.add(rowId(vertex));
  }
  for (const point of payload.records.points) {
    const geometry = row(point).geometry_id;
    if (geometry !== undefined && geometry !== null && !geometryIds.has(String(geometry))) throw new Error("INVALID_EXPORT_STRUCTURE");
  }
  if ([...vertices].some(vertex => !pointIds.has(vertex))) throw new Error("INVALID_EXPORT_STRUCTURE");
  const completionPoints = payload.records.completions.map(completion => String(row(completion).point_id));
  if (completionPoints.length !== members.length || new Set(completionPoints).size !== completionPoints.length || members.some(member => !completionPoints.includes(member))) throw new Error("INVALID_EXPORT_STRUCTURE");
  const attachmentIds = new Set(payload.records.attachments.map(rowId));
  if (attachmentIds.size !== payload.records.attachments.length || payload.records.attachments.some(attachment => !pointIds.has(String(row(attachment).point_id)))) throw new Error("INVALID_EXPORT_STRUCTURE");
  for (const completion of payload.records.completions) if (optionalReferences(completion, "attachments_id").some(attachment => !attachmentIds.has(String(attachment)))) throw new Error("INVALID_EXPORT_STRUCTURE");
  if (payload.records.path !== null) row(payload.records.path);
  const flightId = String(flight.id ?? payload.source.flightId);
  for (const log of payload.records.logs) {
    const current = row(log); const logFlight = current.planid ?? current.planId; const logPoint = current.pointid ?? current.pointId;
    if (logFlight !== undefined && String(logFlight) !== flightId || logPoint !== undefined && !pointIds.has(String(logPoint))) throw new Error("INVALID_EXPORT_STRUCTURE");
  }
}

export function verifyExport(envelope: SignedExport, trustedKeys: Record<string, string>, now = Date.now()): FlightMigrationExportV1 {
  if (!envelope || typeof envelope !== "object" || !Object.prototype.hasOwnProperty.call(trustedKeys, envelope.keyId)) throw new Error("UNKNOWN_SIGNING_KEY");
  const bytes = encoded(envelope.payload);
  const digest = createHash("sha256").update(bytes).digest("hex");
  const key = createPublicKey(trustedKeys[envelope.keyId]);
  if (key.asymmetricKeyType !== "ed25519" || digest !== envelope.digest || !verify(null, bytes, key, Buffer.from(envelope.signature, "base64url"))) throw new Error("INVALID_EXPORT_SIGNATURE");
  validate(envelope.payload, now);
  return envelope.payload;
}
