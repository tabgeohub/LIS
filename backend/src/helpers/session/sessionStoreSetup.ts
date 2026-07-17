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

export async function attachSessionStore(
  options: session.SessionOptions,
  sessionCookieMaxAge: number
): Promise<void> {
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
      return;
    }

    console.error(
      JSON.stringify({
        type: "lis.session",
        event: "store.redis_fallback_memory",
        reason: "SESSION_STORE=redis but Redis connection failed",
        ts: new Date().toISOString(),
      })
    );
    return;
  }

  console.warn(
    JSON.stringify({
      type: "lis.session",
      event: "store.memory",
      ts: new Date().toISOString(),
    })
  );
}
