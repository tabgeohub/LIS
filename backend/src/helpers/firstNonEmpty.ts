export function firstNonEmpty(
  candidates: Array<string | undefined | null>,
  fallback = ""
): string {
  for (const value of candidates) {
    if (value) return value;
  }
  return fallback;
}
