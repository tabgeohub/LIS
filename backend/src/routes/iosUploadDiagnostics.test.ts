import assert from "node:assert/strict";
import test from "node:test";
import { uploadDiagnostic, uploadDiagnostics } from "./iosUploadDiagnostics";

test("database and dependency causes are actionable without leaking raw errors", () => {
  for (const [code, cause] of [["42703", "DB_COLUMN_UNAVAILABLE"], ["23503", "DB_REFERENCE_REJECTED"], ["22P02", "DB_INVALID_VALUE"], ["22007", "DB_INVALID_TIMESTAMP"], ["42501", "DB_PERMISSION_DENIED"], ["ECONNREFUSED", "DEPENDENCY_UNAVAILABLE"], ["unknown", "UNCLASSIFIED"]]) {
    const error = Object.assign(new Error("SELECT secret FROM private; password=synthetic-secret"), { code, detail: "token=synthetic-secret", stack: "sensitive-stack", query: "INSERT INTO private" });
    const result = uploadDiagnostic("plan", "FINISHED_PLAN_UNAVAILABLE", 503, error);
    assert.equal(result.cause_code, cause); assert.equal(result.outcome, "unknown");
    assert.match(result.request_id, /^[0-9a-f-]{36}$/); assert(Number.isFinite(Date.parse(result.timestamp)));
    assert(!/synthetic-secret|SELECT|INSERT|private|sensitive-stack/.test(JSON.stringify(result)));
    assert.equal(result.stage, "plan"); assert(result.suggestion.length > 10);
  }
});
function response(statusCode: number, error?: unknown) {
  let body: any; const headers: Record<string, string> = {};
  const res: any = { statusCode, locals: { uploadError: error }, setHeader(k: string, v: string) { headers[k] = v; }, json(value: any) { body = value; return this; } };
  uploadDiagnostics("plan")({} as any, res, () => {});
  return { res, headers, body: () => body };
}
test("error envelope and header share reference; logs contain only safe metadata", () => {
  const events: unknown[] = []; const original = console.error;
  console.error = (...values) => { events.push(values); };
  try {
    const f = response(503, { code: "42703", message: "secret-column", detail: "secret-value" });
    f.res.json({ code: "FINISHED_PLAN_UNAVAILABLE", message: "legacy-sensitive-message" });
    assert.equal(f.headers["X-LIS-Request-ID"], f.body().diagnostic.request_id);
    assert.equal(f.body().diagnostic.cause_code, "DB_COLUMN_UNAVAILABLE");
    assert(!/secret-column|secret-value|legacy-sensitive/.test(JSON.stringify([f.body(), events])));
  } finally { console.error = original; }
});
test("valid feature acknowledgment and successful/legacy response shapes stay unchanged", () => {
  const ack = { operation_key: "synthetic", outcome: "pending", feature_object_id: 12, recovery_context: "synthetic-context" };
  const f = response(202); f.res.json(ack); assert.deepEqual(f.body(), ack); assert.deepEqual(f.headers, {});
  const legacy = { message: "Logs created successfully", flight_id: 7, record_count: 1 };
  const success = response(201); success.res.json(legacy); assert.deepEqual(success.body(), legacy);
});
test("pending readback stays pending, conflicts stay conflicts, authentication has useful action", () => {
  assert.equal(uploadDiagnostic("logs", "LOG_OPERATION_UNCERTAIN", 202).outcome, "pending");
  assert.equal(uploadDiagnostic("photo", "PHOTO_RECOVERY_CONTEXT_CONFLICT", 409).outcome, "not_accepted");
  assert.match(uploadDiagnostic("plan", "AUTHENTICATION_REQUIRED", 401).suggestion, /aan/);
  const result = uploadDiagnostic("photo", "PHOTO_ATTACHMENT_UNCERTAIN", 202, { code: "ARCGIS_AUTH_REJECTED", message: "token=synthetic-secret" });
  assert.equal(result.cause_code, "ARCGIS_AUTH_REJECTED"); assert(!JSON.stringify(result).includes("synthetic-secret"));
});
