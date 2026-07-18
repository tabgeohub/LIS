export function resolveAdminTokenExpiry(
  expires: number | undefined,
  skewBufferMs: number
): number {
  const now = Date.now();
  const expiresRaw = Number(expires || now + 60 * 60 * 1000);
  return expiresRaw - Math.max(0, skewBufferMs) > now
    ? expiresRaw - Math.max(0, skewBufferMs)
    : now + 55 * 60 * 1000;
}
