import type { Request } from "express";
import { keycloakAdminFetch } from "../keycloak/management/users/keycloakAdminClient";
import { hashUsername, logAuthSecurityEvent } from "./authSecurityLog";

type KeycloakUserRecord = {
  id?: string;
  username?: string;
  email?: string;
  enabled?: boolean;
};

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
  if (!cached) {
    return undefined;
  }
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
  if (cached !== undefined) {
    return cached;
  }

  const response = await keycloakAdminFetch(req, `/users/${userId}/credentials`, {
    method: "GET",
  });

  if (!response.ok) {
    logAuthSecurityEvent("auth2.lookup.credentials_failed", {
      userId,
      status: response.status,
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
    const response = await keycloakAdminFetch(
      req,
      `/users?username=${encodeURIComponent(username)}&exact=true`,
      { method: "GET" }
    );

    if (!response.ok) {
      logAuthSecurityEvent("auth2.lookup.users_failed", {
        usernameHash: hashUsername(username),
        status: response.status,
      });
      return { ok: false, reason: "lookup_unavailable" };
    }

    const users = (await response.json()) as KeycloakUserRecord[];
    let user = users.find(
      (entry) =>
        entry?.id &&
        String(entry.username || "").toLowerCase() === username.toLowerCase()
    );

    if (!user?.id) {
      const searchResponse = await keycloakAdminFetch(
        req,
        `/users?search=${encodeURIComponent(username)}&max=20`,
        { method: "GET" }
      );

      if (searchResponse.ok) {
        const searchUsers = (await searchResponse.json()) as KeycloakUserRecord[];
        const normalized = username.toLowerCase();
        user = searchUsers.find(
          (entry) =>
            entry?.id &&
            (String(entry.username || "").toLowerCase() === normalized ||
              String(entry.email || "").toLowerCase() === normalized)
        );
      }
    }

    if (!user?.id) {
      return { ok: false, reason: "not_found" };
    }

    if (user.enabled === false) {
      return { ok: false, reason: "not_found" };
    }

    const hasOtp = await userHasOtpCredential(req, user.id);
    return { ok: true, userId: user.id, hasOtp };
  } catch (error) {
    logAuthSecurityEvent("auth2.lookup.error", {
      usernameHash: hashUsername(username),
      message: (error as Error)?.message,
    });
    return { ok: false, reason: "lookup_unavailable" };
  }
}
