import crypto from "node:crypto";
import { RecoverySigner } from "./iosRecovery";

/** Short-lived process-bound, single-use first-write proof. No persistent store.
 * A restart invalidates all outstanding permits. Consumed keys never expire
 * within this process; at the bound we refuse new work instead of evicting.
 */
export class WritePermits {
  private readonly boot = crypto.randomUUID();
  private readonly operations = new Map<string, { hash: string; consumed: boolean; token: string }>();
  issue(subject: string, operation: string, hash: string, signer: RecoverySigner): string {
    const key = subject + "/" + operation;
    const existing = this.operations.get(key);
    if (existing) {
      if (existing.hash !== hash || existing.consumed) throw new Error("WRITE_REVIEW_REQUIRED");
      return existing.token;
    }
    if (this.operations.size >= 10000) throw new Error("WRITE_PERMIT_CAPACITY");
    const token = signer.sign("first-write", subject, { boot: this.boot, operation, hash });
    this.operations.set(key, { hash, token, consumed: false });
    return token;
  }
  consume(subject: string, operation: string, hash: string, token: string, signer: RecoverySigner): void {
    const evidence = signer.verify(token, "first-write", subject);
    const entry = this.operations.get(subject + "/" + operation);
    if (evidence.boot !== this.boot || evidence.operation !== operation || evidence.hash !== hash ||
      !entry || entry.hash !== hash || entry.token !== token || entry.consumed) throw new Error("WRITE_REVIEW_REQUIRED");
    entry.consumed = true;
  }
}
