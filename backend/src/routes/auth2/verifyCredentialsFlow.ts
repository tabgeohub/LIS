import type { Request } from "express";
import { getOidcClientFor } from "../auth/oidc";
import { attemptPasswordGrant, classifyGrantFailure } from "./grantHelpers";
import type { KeycloakUserLookupResult } from "./keycloakUserLookup";
import { persistLoginSession } from "./persistLoginSession";

export type VerifyLookupDecision =
  | { kind: "invalid_username" }
  | { kind: "otp_required" }
  | { kind: "attempt_password_grant"; otpStatusUnknown: boolean };

function isNotFoundLookup(lookup: KeycloakUserLookupResult): boolean {
  return !lookup.ok && lookup.reason === "not_found";
}

function hasConfirmedOtp(lookup: KeycloakUserLookupResult): boolean {
  return Boolean(lookup.ok && lookup.hasOtp === true);
}

function isOtpStatusUnknown(lookup: KeycloakUserLookupResult): boolean {
  return !lookup.ok || lookup.hasOtp === null;
}

export function classifyVerifyLookup(
  lookup: KeycloakUserLookupResult
): VerifyLookupDecision {
  if (isNotFoundLookup(lookup)) {
    return { kind: "invalid_username" };
  }
  if (hasConfirmedOtp(lookup)) {
    return { kind: "otp_required" };
  }
  return {
    kind: "attempt_password_grant",
    otpStatusUnknown: isOtpStatusUnknown(lookup),
  };
}

export function classifyVerifyGrantFailure(
  error: unknown,
  otpStatusUnknown: boolean
) {
  const grantFailureKind = classifyGrantFailure(error, { otpWasSent: false });
  const ambiguous =
    grantFailureKind === "ambiguous_invalid_grant" ||
    grantFailureKind === "unknown";
  return {
    grantFailureKind,
    requiresOtp:
      grantFailureKind === "otp_required" ||
      (otpStatusUnknown && ambiguous),
  };
}

export async function authenticatePasswordCredentials(input: {
  req: Request;
  username: string;
  password: string;
}) {
  const { client } = await getOidcClientFor(input.req);
  const tokenSet = await attemptPasswordGrant({
    client,
    username: input.username,
    password: input.password,
  });
  const userInfo = await client.userinfo(tokenSet.access_token!);
  await persistLoginSession({ req: input.req, tokenSet, userInfo });
  return {
    username: userInfo.preferred_username || userInfo.email,
    name: userInfo.name,
    email: userInfo.email,
  };
}
