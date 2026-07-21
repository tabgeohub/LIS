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

function jsonVerifyResponse(
  res: Response,
  status: number | undefined,
  body: object
) {
  return status === undefined ? res.json(body) : res.status(status).json(body);
}

function respondLoggedVerify(input: {
  req: Request;
  res: Response;
  username: string;
  event: string;
  meta?: Record<string, unknown>;
  status?: number;
  body: object;
}) {
  logVerifyEvent({
    req: input.req,
    event: input.event,
    username: input.username,
    meta: input.meta,
  });
  return jsonVerifyResponse(input.res, input.status, input.body);
}

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
    return respondLoggedVerify({
      req: input.req,
      res: input.res,
      username: input.username,
      event: "auth2.verify.otp_required",
      meta: {
        hasOtp,
        grantFailureKind: grant.grantFailureKind,
        inferred: grant.grantFailureKind !== "otp_required",
      },
      body: OTP_REQUIRED_RESPONSE,
    });
  }
  return respondLoggedVerify({
    req: input.req,
    res: input.res,
    username: input.username,
    event: "auth2.verify.invalid_password",
    meta: {
      hasOtp,
      grantFailureKind: grant.grantFailureKind,
      message: (input.error as Error)?.message,
    },
    status: 401,
    body: invalidPasswordResponse(),
  });
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
