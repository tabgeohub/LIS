const HTTP_PREFIX_RE = /^https?:\/\//i;
const ENCODED_HTTP_PREFIX_RE = /^https?%3A%2F%2F/i;

export function decodeMaybeEncodedUrl(value: string): string {
  if (ENCODED_HTTP_PREFIX_RE.test(value)) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return value;
}

function extractFromRawQuery(rawQuery: string): string | null {
  if (!rawQuery) return null;

  if (rawQuery.startsWith("url=")) {
    return decodeMaybeEncodedUrl(rawQuery.slice(4));
  }

  if (HTTP_PREFIX_RE.test(rawQuery) || ENCODED_HTTP_PREFIX_RE.test(rawQuery)) {
    return decodeMaybeEncodedUrl(rawQuery);
  }

  return null;
}

function findUrlFromOriginalUrl(original: string): string | null {
  const qIndex = original.indexOf("?");
  if (qIndex === -1) return null;
  return extractFromRawQuery(original.slice(qIndex + 1));
}

function findHttpUrlInQueryKeys(query: Record<string, unknown>): string | null {
  for (const key of Object.keys(query || {})) {
    const value = query[key];
    if (typeof value === "string") {
      const decodedValue = decodeMaybeEncodedUrl(value);
      if (HTTP_PREFIX_RE.test(decodedValue)) return decodedValue;
    }
    const decodedKey = decodeMaybeEncodedUrl(key);
    if (HTTP_PREFIX_RE.test(decodedKey)) return decodedKey;
  }
  return null;
}

export function extractTargetUrlFromRequest(req: {
  query: Record<string, unknown>;
  originalUrl?: string;
  url?: string;
}): string | null {
  if (typeof req.query?.url === "string" && req.query.url) {
    return decodeMaybeEncodedUrl(req.query.url);
  }

  const original = req.originalUrl || req.url || "";
  const fromOriginal = findUrlFromOriginalUrl(original);
  if (fromOriginal) return fromOriginal;

  return findHttpUrlInQueryKeys(req.query || {});
}
