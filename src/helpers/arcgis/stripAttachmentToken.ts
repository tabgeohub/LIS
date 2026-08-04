/** Remove token query params from a non-absolute attachment URL. */
export function stripTokenFromRawUrl(raw: string): string {
  return raw.replace(/[?&]token=[^&]*/g, "").replace(/[?&]$/, "");
}

/** Parse an absolute URL and drop the token query param. */
export function stripTokenFromAbsoluteUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw);
    parsed.searchParams.delete("token");
    return parsed.toString();
  } catch {
    return null;
  }
}
