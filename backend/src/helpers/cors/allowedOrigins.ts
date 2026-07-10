/**
 * Allowed CORS origins for credentialed requests (lis.sid cookie).
 *
 * Desktop dev:     http://localhost:5173
 * Desktop packaged: app://.
 * LIS web:         PUBLIC_FRONTEND_URL / INTRANET_FRONTEND_URL
 *
 * Origin "null" is intentionally not allowed (sandboxed / file:// embeddings).
 */
export const allowedCorsOrigins = new Set(
  [
    process.env.PUBLIC_FRONTEND_URL,
    process.env.INTRANET_FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "app://.",
  ].filter((origin): origin is string => Boolean(origin))
);

export function isAllowedCorsOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return false;
  }
  return allowedCorsOrigins.has(origin);
}
