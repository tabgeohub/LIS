import { canonicalJson, Json } from "./exportContract";

export interface MigrationPreview {
  id: string; actorSubject: string; actorIssuer: string; expiresAt: number;
  sourceInstance: string; sourceFlightId: string; exportId: string; digest: string;
  region: string; proposal: Json;
}
export interface MigrationResult { operationId: string; region: string; digest: string; destinationFlightId: string }
export interface CommitTransaction {
  lockPreview(id: string): Promise<MigrationPreview | null>;
  findTransfer(instance: string, flight: string): Promise<MigrationResult | null>;
  /** Must coordinate with all legacy writers and acquire table locks in a fixed order. */
  lockWriters(): Promise<void>;
  recompute(preview: MigrationPreview): Promise<Json>;
  /** Must insert all business rows, transfer record and mappings in this transaction. */
  importFlight(preview: MigrationPreview): Promise<MigrationResult>;
}
export interface CommitAdapters {
  getPreview(id: string): Promise<MigrationPreview | null>;
  sourceDigest(preview: MigrationPreview): Promise<string>;
  checkPhotos(preview: MigrationPreview): Promise<boolean>;
  transaction<T>(work: (tx: CommitTransaction) => Promise<T>): Promise<T>;
}
function authorize(preview: MigrationPreview | null, actor: { subject: string; issuer: string }, now: number): asserts preview is MigrationPreview {
  if (!preview || preview.actorSubject !== actor.subject || preview.actorIssuer !== actor.issuer) throw new Error("PREVIEW_NOT_FOUND");
  if (preview.expiresAt <= now) throw new Error("PREVIEW_EXPIRED");
}
/** Caller must enforce fresh exact-admin authentication and feature configuration. */
export async function commitPreview(adapters: CommitAdapters, id: string, actor: { subject: string; issuer: string }, now = Date.now()): Promise<MigrationResult> {
  const preview = await adapters.getPreview(id);
  authorize(preview, actor, now);
  // Network operations are deliberately outside the destination transaction.
  if (await adapters.sourceDigest(preview) !== preview.digest) throw new Error("SOURCE_CHANGED");
  if (!(await adapters.checkPhotos(preview))) throw new Error("PHOTOS_UNAVAILABLE");
  return adapters.transaction(async tx => {
    const locked = await tx.lockPreview(id);
    authorize(locked, actor, Date.now());
    if (canonicalJson(locked as unknown as Json) !== canonicalJson(preview as unknown as Json)) throw new Error("PREVIEW_CHANGED");
    const existing = await tx.findTransfer(locked.sourceInstance, locked.sourceFlightId);
    if (existing) {
      if (existing.digest !== locked.digest || existing.region !== locked.region) throw new Error("DESTINATION_CONFLICT");
      return existing;
    }
    await tx.lockWriters();
    // Recheck after serialization, because another migration may have committed while waiting.
    const concurrent = await tx.findTransfer(locked.sourceInstance, locked.sourceFlightId);
    if (concurrent) {
      if (concurrent.digest !== locked.digest || concurrent.region !== locked.region) throw new Error("DESTINATION_CONFLICT");
      return concurrent;
    }
    if (canonicalJson(await tx.recompute(locked)) !== canonicalJson(locked.proposal)) throw new Error("DESTINATION_CHANGED");
    return tx.importFlight(locked);
  });
}
