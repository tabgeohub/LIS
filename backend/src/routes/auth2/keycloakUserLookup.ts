import type { Request } from "express";
import { keycloakAdminFetch } from "../keycloak/management/users/keycloakAdminClient";
import { hashUsername, logAuthSecurityEvent } from "./authSecurityLog";
import { resolveKeycloakUserRecord } from "./keycloakUserResolve";

type KeycloakCredential = {
  type?: string;
};

type OtpCacheEntry = {
  hasOtp: boolean | null;
  expiresAt: number;
};

const otpCredentialCache = new Map<string, OtpCacheEntry>();

export type KeycloakUserLookupResult =
  | { ok: true; userId: string; hasOtp: boolean | null }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "lookup_unavailable" };

function getOtpCacheTtlMs(): number {
  const parsed = parseInt(process.env.AUTH2_OTP_CACHE_TTL_MS || "300000", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300_000;
}

function getCachedOtpStatus(userId: string): boolean | null | undefined {
  const cached = otpCredentialCache.get(userId);
  if (!cached) return undefined;
  if (cached.expiresAt <= Date.now()) {
    otpCredentialCache.delete(userId);
    return undefined;
  }
  return cached.hasOtp;
}

function setCachedOtpStatus(userId: string, hasOtp: boolean | null): void {
  otpCredentialCache.set(userId, {
    hasOtp,
    expiresAt: Date.now() + getOtpCacheTtlMs(),
  });
}

async function userHasOtpCredential(
  req: Request,
  userId: string
): Promise<boolean | null> {
  const cached = getCachedOtpStatus(userId);
  if (cached !== undefined) return cached;

  const response = await keycloakAdminFetch(req, `/users/${userId}/credentials`, {
    method: "GET",
  });

  if (!response.ok) {
    logAuthSecurityEvent({
      event: "auth2.lookup.credentials_failed",
      meta: {
        userId,
        status: response.status,
      },
    });
    return null;
  }

  const credentials = (await response.json()) as KeycloakCredential[];
  const hasOtp = credentials.some((credential) => {
    const type = String(credential.type || "").toLowerCase();
    return type === "otp" || type === "totp";
  });

  setCachedOtpStatus(userId, hasOtp);
  return hasOtp;
}

export async function lookupKeycloakUser(
  req: Request,
  username: string
): Promise<KeycloakUserLookupResult> {
  try {
    const resolved = await resolveKeycloakUserRecord(req, username);
    if (!resolved.ok) return resolved;

    const hasOtp = await userHasOtpCredential(req, resolved.user.id);
    return { ok: true, userId: resolved.user.id, hasOtp };
  } catch (error) {
    logAuthSecurityEvent({
      event: "auth2.lookup.error",
      meta: {
        usernameHash: hashUsername(username),
        message: (error as Error)?.message,
      },
    });
    return { ok: false, reason: "lookup_unavailable" };
  }
}
