import { OIDC_PROFILES } from "../oidcProfiles";
import { safeReturnPath } from "./safeReturnPath";

export function resolvePostLoginRedirectUrl(
  profileKey: string,
  rawAfterLogin: unknown
): string {
  const profile =
    OIDC_PROFILES[profileKey as keyof typeof OIDC_PROFILES] ??
    OIDC_PROFILES.public;
  const base = profile.frontendUrl.replace(/\/$/, "");
  const afterPath = safeReturnPath(rawAfterLogin);
  if (!afterPath) {
    return profile.frontendUrl;
  }
  return base + afterPath;
}
