import type { RequestHandler } from "express";
import { ensureFreshSession } from "../../helpers/auth/ensureFreshSession";
import {
  buildAuth2MeBody,
  unauthenticatedMeBody,
} from "./buildAuth2MeBody";

function formatAccessTokenExpiry(expiresAtSec: number | undefined): string | null {
  if (!expiresAtSec) return null;
  return new Date(expiresAtSec * 1000).toISOString();
}

export const meHandler: RequestHandler = async (req, res) => {
  const sessionResult = await ensureFreshSession(req);
  const auth = req.session.auth;

  if (!sessionResult.ok || !auth?.tokenSet?.access_token) {
    return res.status(401).json({
      authenticated: false,
      ...unauthenticatedMeBody(),
    });
  }

  const body = buildAuth2MeBody(req.session, auth);
  const accessTokenExpiresAt = formatAccessTokenExpiry(auth.tokenSet.expires_at);

  return res.json({
    authenticated: true,
    ...body,
    ...(accessTokenExpiresAt
      ? { session: { accessTokenExpiresAt } }
      : {}),
  });
};
