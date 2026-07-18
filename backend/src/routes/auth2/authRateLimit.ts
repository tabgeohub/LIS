import { RedisStore } from "rate-limit-redis";
import { getRedisClient } from "../../helpers/redis/getRedisClient";
import { logAuthSecurityEvent } from "./authSecurityLog";
import {
  createLimiter,
  parsePositiveInt,
  type Auth2RateLimiters,
} from "./authRateLimitHelpers";

export type { Auth2RateLimiters } from "./authRateLimitHelpers";

async function resolveAuth2RateLimitStore(): Promise<RedisStore | undefined> {
  const redisClient = await getRedisClient();
  if (!redisClient) {
    logAuthSecurityEvent("auth2.rate_limit.store", { store: "memory" });
    return undefined;
  }

  logAuthSecurityEvent("auth2.rate_limit.store", { store: "redis" });
  return new RedisStore({
    prefix: "lis:auth2:rl:",
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  });
}

function readAuth2RateLimitConfig(): {
  windowMs: number;
  verifyMax: number;
  loginMax: number;
} {
  return {
    windowMs: parsePositiveInt(
      process.env.AUTH2_RATE_LIMIT_WINDOW_MS,
      15 * 60 * 1000
    ),
    verifyMax: parsePositiveInt(
      process.env.AUTH2_VERIFY_RATE_LIMIT_MAX ||
        process.env.AUTH2_RATE_LIMIT_MAX,
      10
    ),
    loginMax: parsePositiveInt(process.env.AUTH2_LOGIN_RATE_LIMIT_MAX, 8),
  };
}

export async function createAuth2RateLimiters(): Promise<Auth2RateLimiters> {
  const { windowMs, verifyMax, loginMax } = readAuth2RateLimitConfig();
  const store = await resolveAuth2RateLimitStore();

  return {
    verifyCredentials: createLimiter({
      endpoint: "verify-credentials",
      max: verifyMax,
      windowMs,
      store,
    }),
    login: createLimiter({
      endpoint: "login",
      max: loginMax,
      windowMs,
      store,
    }),
  };
}
