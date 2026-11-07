import assert from "node:assert/strict";
import { commitPreview, CommitAdapters, MigrationPreview, MigrationResult } from "./commitCoordinator";

async function main() {
  const preview: MigrationPreview = { id: "preview", actorSubject: "admin", actorIssuer: "prod", expiresAt: Date.now() + 60000, sourceInstance: "tst", sourceFlightId: "1", exportId: "export", digest: "digest", region: "A", proposal: { points: ["1"] } };
  const result: MigrationResult = { operationId: "operation", region: "A", digest: "digest", destinationFlightId: "2" };
  const calls: string[] = [];
  let existing: MigrationResult | null = null;
  let proposal: any = preview.proposal;
  const adapters: CommitAdapters = {
    async getPreview() { calls.push("preview"); return preview; },
    async sourceDigest() { calls.push("digest"); return "digest"; },
    async checkPhotos() { calls.push("photos"); return true; },
    async transaction(work) { calls.push("transaction"); return work({
      async lockPreview() { calls.push("preview-lock"); return preview; },
      async findTransfer() { calls.push("find"); return existing; },
      async lockWriters() { calls.push("writer-lock"); },
      async recompute() { calls.push("recompute"); return proposal; },
      async importFlight() { calls.push("import"); return result; },
    }); },
  };
  const actor = { subject: "admin", issuer: "prod" };
  assert.deepEqual(await commitPreview(adapters, "preview", actor), result);
  assert.deepEqual(calls, ["preview", "digest", "photos", "transaction", "preview-lock", "find", "writer-lock", "find", "recompute", "import"]);
  calls.length = 0; existing = result;
  assert.deepEqual(await commitPreview(adapters, "preview", actor), result);
  assert.equal(calls.includes("import"), false);
  existing = { ...result, region: "B" };
  await assert.rejects(() => commitPreview(adapters, "preview", actor), /DESTINATION_CONFLICT/);
  existing = null; proposal = { points: ["changed"] };
  await assert.rejects(() => commitPreview(adapters, "preview", actor), /DESTINATION_CHANGED/);
  await assert.rejects(() => commitPreview(adapters, "preview", { ...actor, subject: "other" }), /PREVIEW_NOT_FOUND/);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
