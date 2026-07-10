import type { Request } from "express";
import { getOidcClientFor } from "../../routes/auth/oidc";
import { logAuthSecurityEvent } from "../../routes/auth2/authSecurityLog";

export type EnsureFreshSessionResult = {
  ok: boolean;
  refreshed?: boolean;
  reason?: "no_session" | "no_refresh_token" | "refresh_failed";
};

function getRefreshThresholdSec(): number {
  const parsed = parseInt(process.env.AUTH_REFRESH_THRESHOLD_SEC || "60", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
}

function accessTokenExpiresSoon(expiresAtSec: number | undefined): boolean {
  if (!expiresAtSec) return true;

  const nowSec = Math.floor(Date.now() / 1000);
  return expiresAtSec - nowSec <= getRefreshThresholdSec();
}

export async function ensureFreshSession(
  req: Request
): Promise<EnsureFreshSessionResult> {
  const auth = req.session?.auth;

  if (!auth?.tokenSet?.access_token) {
    return { ok: false, reason: "no_session" };
  }

  const { tokenSet } = auth;

  if (!accessTokenExpiresSoon(tokenSet.expires_at)) {
    return { ok: true, refreshed: false };
  }

  if (!tokenSet.refresh_token) {
    delete req.session.auth;
    return { ok: false, reason: "no_refresh_token" };
  }

  try {
    const { client } = await getOidcClientFor(req);
    const refreshed = await client.refresh(tokenSet.refresh_token);

    req.session.auth = {
      ...auth,
      tokenSet: refreshed,
    };

    return { ok: true, refreshed: true };
  } catch (error) {
    logAuthSecurityEvent(
      "auth2.refresh.failed",
      { message: (error as Error)?.message },
      req
    );
    delete req.session.auth;
    return { ok: false, reason: "refresh_failed" };
  }
}
