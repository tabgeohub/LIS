import { createClient, type RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType | null> | null = null;

export function isRedisUrlConfigured(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

export function shouldUseRedisForSessions(): boolean {
  if (!isRedisUrlConfigured()) {
    return false;
  }
  return process.env.SESSION_STORE?.trim().toLowerCase() === "redis";
}

export function shouldUseRedisForRateLimit(): boolean {
  if (!isRedisUrlConfigured()) {
    return false;
  }

  const store = process.env.AUTH2_RATE_LIMIT_STORE?.trim().toLowerCase();
  if (store === "memory") {
    return false;
  }
  if (store === "redis") {
    return true;
  }
  return true;
}

function shouldConnectRedis(): boolean {
  return shouldUseRedisForSessions() || shouldUseRedisForRateLimit();
}

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (!shouldConnectRedis()) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!connectPromise) {
    connectPromise = (async () => {
      const client = createClient({ url: process.env.REDIS_URL });
      client.on("error", (error) => {
        console.error(
          JSON.stringify({
            type: "lis.redis",
            event: "client_error",
            message: error.message,
            ts: new Date().toISOString(),
          })
        );
      });

      try {
        await client.connect();
        redisClient = client;
        console.warn(
          JSON.stringify({
            type: "lis.redis",
            event: "connected",
            sessions: shouldUseRedisForSessions(),
            rateLimit: shouldUseRedisForRateLimit(),
            ts: new Date().toISOString(),
          })
        );
        return client;
      } catch (error) {
        console.error(
          JSON.stringify({
            type: "lis.redis",
            event: "connect_failed",
            message: (error as Error)?.message,
            ts: new Date().toISOString(),
          })
        );
        return null;
      } finally {
        connectPromise = null;
      }
    })();
  }

  return connectPromise;
}
