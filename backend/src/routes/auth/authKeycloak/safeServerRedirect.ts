import type { Response } from "express";
import { OIDC_PROFILES } from "../oidcProfiles";

const ALLOWED_INTERNAL_REDIRECTS = new Set(["/auth/desktop-ok"]);

function allowedRedirectBases(): string[] {
  const bases = new Set<string>();
  for (const profile of Object.values(OIDC_PROFILES)) {
    if (profile.frontendUrl) {
      bases.add(profile.frontendUrl.replace(/\/+$/, ""));
    }
    if (profile.appBaseUrl) {
      bases.add(profile.appBaseUrl.replace(/\/+$/, ""));
    }
  }
  return [...bases];
}

/** Validates redirect targets before Express res.redirect (CWE-601). */
export function isSafeServerRedirectTarget(target: string): boolean {
  if (typeof target !== "string" || target.length === 0) return false;

  if (target.startsWith("/")) {
    if (target.startsWith("//")) return false;
    if (target.includes("\\")) return false;
    if (target.includes("://")) return false;
    const pathOnly = target.split("?")[0].split("#")[0];
    return ALLOWED_INTERNAL_REDIRECTS.has(pathOnly);
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

  return allowedRedirectBases().some((base) => {
    return target === base || target.startsWith(`${base}/`);
  });
}

export function safeServerRedirect(res: Response, target: string): void {
  if (isSafeServerRedirectTarget(target)) {
    res.redirect(target);
    return;
  }

  console.warn("Blocked unsafe redirect target:", target);
  res.redirect(OIDC_PROFILES.public.frontendUrl);
}
