import type { Request, Response } from "express";
import { invalidPasswordResponse, invalidUsernameResponse } from "./authErrorResponses";
import { hashUsername, logAuthSecurityEvent } from "./authSecurityLog";
import type { KeycloakUserLookupResult } from "./keycloakUserLookup";
import {
  authenticatePasswordCredentials,
  classifyVerifyGrantFailure,
  VerifyLookupDecision,
} from "./verifyCredentialsFlow";

const OTP_REQUIRED_RESPONSE = {
  success: true,
  status: "otp_required",
  message: "Authenticator-code is required",
};

export function respondToVerifyLookup(input: {
  req: Request;
  res: Response;
  username: string;
  lookup: KeycloakUserLookupResult;
  decision: VerifyLookupDecision;
}): Response | null {
  const usernameHash = hashUsername(input.username);
  if (input.decision.kind === "invalid_username") {
    logAuthSecurityEvent({
      event: "auth2.verify.invalid_username",
      meta: { usernameHash },
      req: input.req,
    });
    return input.res.status(401).json(invalidUsernameResponse());
  }
  if (!input.lookup.ok && input.lookup.reason === "lookup_unavailable") {
    logAuthSecurityEvent({
      event: "auth2.verify.lookup_unavailable",
      meta: { usernameHash },
      req: input.req,
    });
  }
  if (input.decision.kind === "otp_required") {
    logAuthSecurityEvent({
      event: "auth2.verify.otp_required",
      meta: { usernameHash, hasOtp: true },
      req: input.req,
    });
    return input.res.json(OTP_REQUIRED_RESPONSE);
  }
  return null;
}

export async function authenticateOrRespondToVerifyFailure(input: {
  req: Request;
  res: Response;
  username: string;
  password: string;
  lookup: KeycloakUserLookupResult;
  otpStatusUnknown: boolean;
}) {
  try {
    const user = await authenticatePasswordCredentials(input);
    return input.res.json({ success: true, status: "authenticated", message: "Login successful", user });
  } catch (error: unknown) {
    const grant = classifyVerifyGrantFailure(error, input.otpStatusUnknown);
    const usernameHash = hashUsername(input.username);
    const hasOtp = input.lookup.ok ? input.lookup.hasOtp : "lookup_unavailable";
    if (grant.requiresOtp) {
      logAuthSecurityEvent({
        event: "auth2.verify.otp_required",
        meta: {
          usernameHash,
          hasOtp,
          grantFailureKind: grant.grantFailureKind,
          inferred: grant.grantFailureKind !== "otp_required",
        },
        req: input.req,
      });
      return input.res.json(OTP_REQUIRED_RESPONSE);
    }
    logAuthSecurityEvent({
      event: "auth2.verify.invalid_password",
      meta: {
        usernameHash,
        hasOtp,
        grantFailureKind: grant.grantFailureKind,
        message: (error as Error)?.message,
      },
      req: input.req,
    });
    return input.res.status(401).json(invalidPasswordResponse());
  }
}
