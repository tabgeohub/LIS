/**
 * Validates a post-login redirect target: must be a same-app relative path (path + optional query).
 * Rejects protocol-relative and absolute URLs.
 */

const REJECT_DECODED: Array<(decoded: string) => boolean> = [
  (decoded) => decoded.length > 2048,
  (decoded) => !decoded.startsWith("/"),
  (decoded) => decoded.startsWith("//"),
  (decoded) => decoded.includes("\\"),
  (decoded) => /\s/.test(decoded),
  (decoded) => decoded.includes("://"),
];

function isNonEmptyString(raw: unknown): raw is string {
  return typeof raw === "string" && raw.length > 0;
}

function decodeReturnPath(raw: string): string | null {
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
}

function isRejectedDecodedPath(decoded: string): boolean {
  return REJECT_DECODED.some((reject) => reject(decoded));
}

export function safeReturnPath(raw: unknown): string | null {
  if (!isNonEmptyString(raw)) return null;

  const decoded = decodeReturnPath(raw);
  if (decoded == null) return null;
  if (isRejectedDecodedPath(decoded)) return null;
  return decoded;
}
