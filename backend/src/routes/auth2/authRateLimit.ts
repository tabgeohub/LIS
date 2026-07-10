import type { Request, RequestHandler } from "express";
import { createHash } from "crypto";
import { rateLimit, type Options, type Store } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedisClient } from "../../helpers/redis/getRedisClient";
import { logAuthSecurityEvent } from "./authSecurityLog";

export type Auth2RateLimiters = {
  verifyCredentials: RequestHandler;
  login: RequestHandler;
};

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || req.ip || "unknown";
  }
  return req.ip || "unknown";
}

function hashUsernameForKey(username: string): string {
  return createHash("sha256")
    .update(username.trim().toLowerCase())
    .digest("hex")
    .slice(0, 16);
}

function buildRateLimitKey(req: Request, endpoint: "verify-credentials" | "login"): string {
  const ip = getClientIp(req);
  const username = String(
    (req.body as { username?: unknown })?.username ?? ""
  ).trim();

  const userPart = username ? hashUsernameForKey(username) : "anonymous";
  return `auth2:${endpoint}:${ip}:${userPart}`;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function createRateLimitHandler(endpoint: "verify-credentials" | "login"): Options["handler"] {
  return (req, res, _next, options) => {
    logAuthSecurityEvent(
      "auth2.rate_limited",
      {
        endpoint,
        limit: options.max,
        windowMs: options.windowMs,
      },
      req
    );

    res.status(429).json({
      success: false,
      code: "TOO_MANY_REQUESTS",
      message: "Too many login attempts. Please wait and try again.",
    });
  };
}

function createLimiter(options: {
  endpoint: "verify-credentials" | "login";
  max: number;
  windowMs: number;
  store?: Store;
}): RequestHandler {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    store: options.store,
    keyGenerator: (req) => buildRateLimitKey(req, options.endpoint),
    handler: createRateLimitHandler(options.endpoint),
    skip: (req) => req.method !== "POST",
  });
}

export async function createAuth2RateLimiters(): Promise<Auth2RateLimiters> {
  const windowMs = parsePositiveInt(
    process.env.AUTH2_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000
  );
  const verifyMax = parsePositiveInt(
    process.env.AUTH2_VERIFY_RATE_LIMIT_MAX ||
      process.env.AUTH2_RATE_LIMIT_MAX,
    10
  );
  const loginMax = parsePositiveInt(
    process.env.AUTH2_LOGIN_RATE_LIMIT_MAX,
    8
  );

  const redisClient = await getRedisClient();
  const store = redisClient
    ? new RedisStore({
        prefix: "lis:auth2:rl:",
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      })
    : undefined;

  if (store) {
    logAuthSecurityEvent("auth2.rate_limit.store", { store: "redis" });
  } else {
    logAuthSecurityEvent("auth2.rate_limit.store", { store: "memory" });
  }

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
