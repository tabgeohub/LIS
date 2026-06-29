/**
 * Validates a post-login redirect target: must be a same-app relative path (path + optional query).
 * Rejects protocol-relative and absolute URLs.
 */
export function safeReturnPath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (decoded.length > 2048) return null;
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  if (decoded.includes("\\")) return null;
  if (/\s/.test(decoded)) return null;
  if (decoded.includes("://")) return null;
  return decoded;
}
