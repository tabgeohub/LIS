/**
 * Shared multer limits for CVE-2026-5079 (nested field names DoS).
 * Call sites may override fileSize / files / parts as needed.
 */
export const MULTER_SECURITY_LIMITS = {
  /** Bracket nesting depth for multipart field names (a[b][c] → depth 2). */
  fieldNestingDepth: 2,
  fields: 32,
} as const;
