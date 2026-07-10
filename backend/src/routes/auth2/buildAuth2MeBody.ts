import type { Session } from "express-session";
import {
  buildAuthenticatedMeBody,
  unauthenticatedMeBody,
} from "../auth/authKeycloak/buildMeResponse";

type AuthSession = Parameters<typeof buildAuthenticatedMeBody>[1];

/**
 * `/auth2/me` omits raw idToken claims by default in production.
 * Set AUTH2_ME_INCLUDE_RAW=true to include them (legacy /auth/me parity).
 */
export function shouldIncludeRawMeClaims(): boolean {
  const explicit = process.env.AUTH2_ME_INCLUDE_RAW?.trim().toLowerCase();
  if (explicit === "true" || explicit === "1") {
    return true;
  }
  if (explicit === "false" || explicit === "0") {
    return false;
  }
  return process.env.NODE_ENV !== "production";
}

export function buildAuth2MeBody(session: Session, auth: AuthSession) {
  const body = buildAuthenticatedMeBody(session, auth);

  if (shouldIncludeRawMeClaims()) {
    return body;
  }

  const { raw: _raw, ...withoutRaw } = body as typeof body & {
    raw?: unknown;
  };
  return withoutRaw;
}

export { unauthenticatedMeBody };
