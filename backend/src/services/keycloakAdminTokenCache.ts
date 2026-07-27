type CachedAdminToken = { token: string; expiresAtMs: number };

const cache = new Map<string, CachedAdminToken>();
export const ADMIN_TOKEN_EXPIRY_SKEW_MS = 30_000;
export const ADMIN_TOKEN_FALLBACK_TTL_MS = 60_000;

export function getCachedAdminToken(options: {
  profile: string;
  now?: number;
}) {
  const now = options.now ?? Date.now();
  const cached = cache.get(options.profile);
  return cached && cached.expiresAtMs > now ? cached.token : undefined;
}

export function cacheAdminToken(input: {
  profile: string;
  token: string;
  expiresInSeconds?: number;
  now?: number;
}) {
  const ttlMs =
    typeof input.expiresInSeconds === "number" && input.expiresInSeconds > 0
      ? input.expiresInSeconds * 1000
      : ADMIN_TOKEN_FALLBACK_TTL_MS;
  cache.set(input.profile, {
    token: input.token,
    expiresAtMs:
      (input.now ?? Date.now()) +
      Math.max(ttlMs - ADMIN_TOKEN_EXPIRY_SKEW_MS, 0),
  });
}

export function clearAdminTokenCache() {
  cache.clear();
}
