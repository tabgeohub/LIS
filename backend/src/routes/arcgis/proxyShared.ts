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

function isHttpUrlString(value: string): boolean {
  return HTTP_PREFIX_RE.test(decodeMaybeEncodedUrl(value));
}

function tryDecodeHttpUrl(value: string): string | null {
  if (!isHttpUrlString(value)) return null;
  return decodeMaybeEncodedUrl(value);
}

function httpUrlFromQueryEntry(
  key: string,
  value: unknown
): string | null {
  if (typeof value === "string") {
    const fromValue = tryDecodeHttpUrl(value);
    if (fromValue) return fromValue;
  }
  return tryDecodeHttpUrl(key);
}

function findHttpUrlInQueryKeys(query: Record<string, unknown>): string | null {
  for (const key of Object.keys(query || {})) {
    const hit = httpUrlFromQueryEntry(key, query[key]);
    if (hit) return hit;
  }
  return null;
}

function readQueryUrlParam(query: Record<string, unknown>): string | null {
  if (typeof query?.url === "string" && query.url) {
    return decodeMaybeEncodedUrl(query.url);
  }
  return null;
}

type ProxyUrlRequest = {
  query: Record<string, unknown>;
  originalUrl?: string;
  url?: string;
};

const TARGET_URL_RESOLVERS: Array<(req: ProxyUrlRequest) => string | null> = [
  (req) => readQueryUrlParam(req.query),
  (req) => findUrlFromOriginalUrl(req.originalUrl || req.url || ""),
  (req) => findHttpUrlInQueryKeys(req.query || {}),
];

export function extractTargetUrlFromRequest(req: ProxyUrlRequest): string | null {
  for (const resolve of TARGET_URL_RESOLVERS) {
    const url = resolve(req);
    if (url) return url;
  }
  return null;
}
