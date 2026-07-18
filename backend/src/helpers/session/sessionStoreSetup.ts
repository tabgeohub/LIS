import session from "express-session";
import { RedisStore } from "connect-redis";
import {
  getRedisClient,
  shouldUseRedisForSessions,
} from "../redis/getRedisClient";

export function buildBaseSessionOptions(input: {
  isHttps: boolean;
  sessionCookieMaxAge: number;
}): session.SessionOptions {
  return {
    name: "lis.sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    rolling: process.env.SESSION_ROLLING !== "false",
    cookie: {
      httpOnly: true,
      sameSite: input.isHttps ? "none" : "lax",
      secure: input.isHttps,
      maxAge: input.sessionCookieMaxAge,
    },
  };
}

async function attachRedisSessionStore(
  options: session.SessionOptions,
  sessionCookieMaxAge: number
): Promise<boolean> {
  const redisClient = await getRedisClient();
  if (!redisClient) return false;

  const ttlSec = Math.ceil(sessionCookieMaxAge / 1000);
  options.store = new RedisStore({
    client: redisClient,
    prefix: "lis:sess:",
    ttl: ttlSec,
  });
  console.warn(
    JSON.stringify({
      type: "lis.session",
      event: "store.redis",
      prefix: "lis:sess:",
      ttlSec,
      ts: new Date().toISOString(),
    })
  );
  return true;
}

function logSessionStoreFallback(event: string, reason?: string): void {
  const payload: Record<string, string> = {
    type: "lis.session",
    event,
    ts: new Date().toISOString(),
  };
  if (reason) payload.reason = reason;
  if (event === "store.redis_fallback_memory") {
    console.error(JSON.stringify(payload));
    return;
  }
  console.warn(JSON.stringify(payload));
}

export async function attachSessionStore(
  options: session.SessionOptions,
  sessionCookieMaxAge: number
): Promise<void> {
  if (shouldUseRedisForSessions()) {
    if (await attachRedisSessionStore(options, sessionCookieMaxAge)) return;
    logSessionStoreFallback(
      "store.redis_fallback_memory",
      "SESSION_STORE=redis but Redis connection failed"
    );
    return;
  }
  logSessionStoreFallback("store.memory");
}
