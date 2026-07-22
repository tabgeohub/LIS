import type { Request, Response } from "express";
import { invalidPasswordResponse } from "./authErrorResponses";
import type { KeycloakUserLookupResult } from "./keycloakUserLookup";
import {
  OTP_REQUIRED_RESPONSE,
  respondLoggedVerify,
} from "./verifyLoggedResponse";
import { classifyVerifyGrantFailure } from "./verifyCredentialsFlow";

export function respondToVerifyGrantFailure(input: {
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
