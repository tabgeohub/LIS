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

function logVerifyEvent(input: {
  req: Request;
  event: string;
  username: string;
  meta?: Record<string, unknown>;
}) {
  logAuthSecurityEvent({
    event: input.event,
    meta: { usernameHash: hashUsername(input.username), ...input.meta },
    req: input.req,
  });
}

export function respondToVerifyLookup(input: {
  req: Request;
  res: Response;
  username: string;
  lookup: KeycloakUserLookupResult;
  decision: VerifyLookupDecision;
}): Response | null {
  if (input.decision.kind === "invalid_username") {
    logVerifyEvent({
      req: input.req,
      event: "auth2.verify.invalid_username",
      username: input.username,
    });
    return input.res.status(401).json(invalidUsernameResponse());
  }
  if (!input.lookup.ok && input.lookup.reason === "lookup_unavailable") {
    logVerifyEvent({
      req: input.req,
      event: "auth2.verify.lookup_unavailable",
      username: input.username,
    });
  }
  if (input.decision.kind === "otp_required") {
    logVerifyEvent({
      req: input.req,
      event: "auth2.verify.otp_required",
      username: input.username,
      meta: { hasOtp: true },
    });
    return input.res.json(OTP_REQUIRED_RESPONSE);
  }
  return null;
}

function respondToGrantFailure(input: {
  req: Request;
  res: Response;
  username: string;
  lookup: KeycloakUserLookupResult;
  error: unknown;
  otpStatusUnknown: boolean;
}) {
  const grant = classifyVerifyGrantFailure(input.error, input.otpStatusUnknown);
  const hasOtp = input.lookup.ok ? input.lookup.hasOtp : "lookup_unavailable";
  if (grant.requiresOtp) {
    logVerifyEvent({
      req: input.req,
      event: "auth2.verify.otp_required",
      username: input.username,
      meta: {
        hasOtp,
        grantFailureKind: grant.grantFailureKind,
        inferred: grant.grantFailureKind !== "otp_required",
      },
    });
    return input.res.json(OTP_REQUIRED_RESPONSE);
  }
  logVerifyEvent({
    req: input.req,
    event: "auth2.verify.invalid_password",
    username: input.username,
    meta: {
      hasOtp,
      grantFailureKind: grant.grantFailureKind,
      message: (input.error as Error)?.message,
    },
  });
  return input.res.status(401).json(invalidPasswordResponse());
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
    return input.res.json({
      success: true,
      status: "authenticated",
      message: "Login successful",
      user,
    });
  } catch (error: unknown) {
    return respondToGrantFailure({ ...input, error });
  }
}
