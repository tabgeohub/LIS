/** Human-readable byte size (B / KB / MB / …). */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exp = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const size = bytes / Math.pow(1024, exp);
  return `${size.toFixed(size >= 10 || exp === 0 ? 0 : 1)} ${units[exp]}`;
}
