import session from "express-session";
import { RedisStore } from "connect-redis";
import { getRedisClient, shouldUseRedisForSessions } from "../redis/getRedisClient";

/** Default backend session cookie lifetime: 8 hours (28_800_000 ms). */
const DEFAULT_SESSION_COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

/**
 * Parses SESSION_COOKIE_MAX_AGE_MS (milliseconds).
 *
 * Effective login/session usability depends on BOTH:
 * 1. Keycloak — access token TTL, refresh token lifetime, SSO session max
 * 2. Backend — Express session cookie maxAge and Redis store TTL (when enabled)
 *
 * If the Express cookie expires before Keycloak refresh tokens, the Desktop app
 * must log in again even though Keycloak may still consider the user signed in.
 *
 * Optional: SESSION_ROLLING (default true) extends cookie maxAge on each request
 * that touches the session (e.g. /auth2/me when ensureFreshSession runs).
 */
function parseSessionCookieMaxAge(): number {
  const parsed = parseInt(
    process.env.SESSION_COOKIE_MAX_AGE_MS ||
      String(DEFAULT_SESSION_COOKIE_MAX_AGE_MS),
    10
  );
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_SESSION_COOKIE_MAX_AGE_MS;
}

export async function createSessionMiddleware() {
  const isHttps = (process.env.PUBLIC_APP_BASE_URL || "").startsWith("https");
  const sessionCookieMaxAge = parseSessionCookieMaxAge();

  const options: session.SessionOptions = {
    name: "lis.sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    rolling: process.env.SESSION_ROLLING !== "false",
    cookie: {
      httpOnly: true,
      sameSite: isHttps ? "none" : "lax",
      secure: isHttps,
      maxAge: sessionCookieMaxAge,
    },
  };

  if (shouldUseRedisForSessions()) {
    const redisClient = await getRedisClient();
    if (redisClient) {
      options.store = new RedisStore({
        client: redisClient,
        prefix: "lis:sess:",
        ttl: Math.ceil(sessionCookieMaxAge / 1000),
      });

      console.warn(
        JSON.stringify({
          type: "lis.session",
          event: "store.redis",
          prefix: "lis:sess:",
          ttlSec: Math.ceil(sessionCookieMaxAge / 1000),
          ts: new Date().toISOString(),
        })
      );
    } else {
      console.error(
        JSON.stringify({
          type: "lis.session",
          event: "store.redis_fallback_memory",
          reason: "SESSION_STORE=redis but Redis connection failed",
          ts: new Date().toISOString(),
        })
      );
    }
  } else {
    console.warn(
      JSON.stringify({
        type: "lis.session",
        event: "store.memory",
        ts: new Date().toISOString(),
      })
    );
  }

  return session(options);
}
