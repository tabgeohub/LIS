import type { Request } from "express";
import { getOidcClientFor } from "../../routes/auth/oidc";
import { logAuthSecurityEvent } from "../../routes/auth2/authSecurityLog";
import type { EnsureFreshSessionResult } from "./ensureFreshSessionTypes";

export function getRefreshThresholdSec(): number {
  const parsed = parseInt(process.env.AUTH_REFRESH_THRESHOLD_SEC || "60", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
}

export function accessTokenExpiresSoon(expiresAtSec: number | undefined): boolean {
  if (!expiresAtSec) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return expiresAtSec - nowSec <= getRefreshThresholdSec();
}

export async function refreshSessionTokens(
  req: Request
): Promise<EnsureFreshSessionResult> {
  const auth = req.session?.auth;
  const refreshToken = auth?.tokenSet?.refresh_token;

  if (!auth || !refreshToken) {
    delete req.session.auth;
    return { ok: false, reason: "no_refresh_token" };
  }

  try {
    const { client } = await getOidcClientFor(req);
    const refreshed = await client.refresh(refreshToken);
    req.session.auth = { ...auth, tokenSet: refreshed };
    return { ok: true, refreshed: true };
  } catch (error) {
    logAuthSecurityEvent({
      event: "auth2.refresh.failed",
      meta: { message: (error as Error)?.message },
      req,
    });
    delete req.session.auth;
    return { ok: false, reason: "refresh_failed" };
  }
}
