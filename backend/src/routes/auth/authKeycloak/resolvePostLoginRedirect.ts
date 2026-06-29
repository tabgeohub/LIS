import type { Session } from "express-session";
import { OIDC_PROFILES } from "../oidcProfiles";
import { safeReturnPath } from "./safeReturnPath";

type SessionWithPending = Session & { pendingClientPath?: string };

export function getOidcProfile(profileKey: string) {
  return (
    OIDC_PROFILES[profileKey as keyof typeof OIDC_PROFILES] ??
    OIDC_PROFILES.public
  );
}

/** Fixed post-login URL from server config only (no user-controlled redirect target). */
export function getFixedPostLoginRedirectUrl(profileKey: string): string {
  return getOidcProfile(profileKey).frontendUrl;
}

/**
 * Stores a validated in-app path for the SPA to apply after login.
 * Express redirect uses only getFixedPostLoginRedirectUrl — never user input.
 */
export function storePendingClientRedirect(
  session: SessionWithPending,
  rawAfterLogin: unknown
): void {
  const afterPath = safeReturnPath(rawAfterLogin);
  if (afterPath) {
    session.pendingClientPath = afterPath;
  }
}

export function consumePendingClientRedirect(
  session: SessionWithPending
): string | undefined {
  const path = session.pendingClientPath;
  if (path) {
    delete session.pendingClientPath;
  }
  return path;
}

/** @deprecated Use getFixedPostLoginRedirectUrl + storePendingClientRedirect */
export function resolvePostLoginRedirectUrl(
  profileKey: string,
  rawAfterLogin: unknown
): string {
  const profile = getOidcProfile(profileKey);
  const afterPath = safeReturnPath(rawAfterLogin);
  if (!afterPath) {
    return profile.frontendUrl;
  }
  const base = profile.frontendUrl.replace(/\/$/, "");
  return base + afterPath;
}
