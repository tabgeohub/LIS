import crypto from "node:crypto";

/** Stateless evidence, not a durable operation registry or cross-device lease. */
export class RecoverySigner {
  private readonly key: Buffer;
  constructor(secret: string) {
    if (!secret) throw new Error("RECOVERY_SIGNING_UNAVAILABLE");
    this.key = crypto.createHmac("sha256", secret).update("lis/ios-upload/v2/recovery").digest();
  }
  sign(purpose: string, subject: string, evidence: Record<string, unknown>): string {
    const body = Buffer.from(JSON.stringify({ version: 2, purpose, subject, evidence })).toString("base64url");
    return `${body}.${crypto.createHmac("sha256", this.key).update(body).digest("base64url")}`;
  }
  verify(token: string, purpose: string, subject: string): Record<string, any> {
    if (token.length > 32768) throw new Error("RECOVERY_CONTEXT_INVALID");
    const [body, signature, extra] = token.split(".");
    const expected = crypto.createHmac("sha256", this.key).update(body || "").digest();
    const actual = Buffer.from(signature || "", "base64url");
    if (extra || actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new Error("RECOVERY_CONTEXT_INVALID");
    const decoded = JSON.parse(Buffer.from(body, "base64url").toString());
    if (decoded.version !== 2 || decoded.purpose !== purpose || decoded.subject !== subject) throw new Error("RECOVERY_CONTEXT_CONFLICT");
    return decoded.evidence;
  }
}
export const recoverySigner = (): RecoverySigner => new RecoverySigner(process.env.SESSION_SECRET || "");
export const validOperationKey = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export function canonical(value: any): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
  return JSON.stringify(value);
}
export const digest = (value: unknown): string => crypto.createHash("sha256").update(canonical(value)).digest("hex");
