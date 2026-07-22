import type { Request, Response } from "express";
import { invalidUsernameResponse } from "./authErrorResponses";
import type { KeycloakUserLookupResult } from "./keycloakUserLookup";
import type { VerifyLookupDecision } from "./verifyCredentialsFlow";
import {
  OTP_REQUIRED_RESPONSE,
  logVerifyEvent,
  respondLoggedVerify,
} from "./verifyLoggedResponse";

export { authenticateOrRespondToVerifyFailure } from "./authenticateOrRespondToVerifyFailure";

function logLookupUnavailableIfNeeded(input: {
  req: Request;
  username: string;
  lookup: KeycloakUserLookupResult;
}) {
  if (!input.lookup.ok && input.lookup.reason === "lookup_unavailable") {
    logVerifyEvent({
      req: input.req,
      event: "auth2.verify.lookup_unavailable",
      username: input.username,
    });
  }
}

export function respondToVerifyLookup(input: {
  req: Request;
  res: Response;
  username: string;
  lookup: KeycloakUserLookupResult;
  decision: VerifyLookupDecision;
}): Response | null {
  if (input.decision.kind === "invalid_username") {
    return respondLoggedVerify({
      ...input,
      event: "auth2.verify.invalid_username",
      status: 401,
      body: invalidUsernameResponse(),
    });
  }
  logLookupUnavailableIfNeeded(input);
  if (input.decision.kind !== "otp_required") return null;
  return respondLoggedVerify({
    ...input,
    event: "auth2.verify.otp_required",
    meta: { hasOtp: true },
    body: OTP_REQUIRED_RESPONSE,
  });
}
