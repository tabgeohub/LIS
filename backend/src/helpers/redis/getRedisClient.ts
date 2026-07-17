import { type RedisClientType } from "redis";
import {
  connectRedisClient,
  logRedisConnected,
} from "./connectRedisClient";

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
      try {
        const client = await connectRedisClient(process.env.REDIS_URL);
        if (client) {
          redisClient = client;
          logRedisConnected({
            sessions: shouldUseRedisForSessions(),
            rateLimit: shouldUseRedisForRateLimit(),
          });
        }
        return client;
      } finally {
        connectPromise = null;
      }
    })();
  }

  return connectPromise;
}
