import type { Request } from "express";
import {
  accessTokenExpiresSoon,
  refreshSessionTokens,
} from "./ensureFreshSessionHelpers";
import type { EnsureFreshSessionResult } from "./ensureFreshSessionTypes";

export type { EnsureFreshSessionResult };

export async function ensureFreshSession(
  req: Request
): Promise<EnsureFreshSessionResult> {
  const auth = req.session?.auth;

  if (!auth?.tokenSet?.access_token) {
    return { ok: false, reason: "no_session" };
  }

  if (!accessTokenExpiresSoon(auth.tokenSet.expires_at)) {
    return { ok: true, refreshed: false };
  }

  return refreshSessionTokens(req);
}
