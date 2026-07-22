import type { RequestHandler, Response } from "express";
import type { Request } from "express";
import { logAuthSecurityEvent } from "./authSecurityLog";
import { lookupKeycloakUser } from "./keycloakUserLookup";
import { parseVerifyInput } from "./validateLoginInput";
import { classifyVerifyLookup } from "./verifyCredentialsFlow";
import {
  authenticateOrRespondToVerifyFailure,
  respondToVerifyLookup,
} from "./verifyCredentialsResponses";

function respondMissingVerifyFields(res: Response) {
  return res.status(400).json({
    success: false,
    status: "invalid_credentials",
    code: "MISSING_FIELDS",
    message: "Username and password are required",
  });
}

function respondVerifyError(input: {
  req: Request;
  res: Response;
  error: unknown;
}) {
  logAuthSecurityEvent({
    event: "auth2.verify.error",
    meta: { message: (input.error as Error)?.message },
    req: input.req,
  });
  return input.res.status(500).json({
    success: false,
    status: "error",
    message: "Login failed",
    error:
      process.env.NODE_ENV !== "production"
        ? (input.error as Error)?.message
        : undefined,
  });
}

export const verifyCredentialsHandler: RequestHandler = async (req, res) => {
  const credentials = parseVerifyInput(req.body);
  if (!credentials) {
    return respondMissingVerifyFields(res);
  }

  try {
    const lookup = await lookupKeycloakUser(req, credentials.username);
    const decision = classifyVerifyLookup(lookup);
    const lookupResponse = respondToVerifyLookup({
      req,
      res,
      username: credentials.username,
      lookup,
      decision,
    });
    if (lookupResponse) return lookupResponse;
    if (decision.kind !== "attempt_password_grant") return;
    return authenticateOrRespondToVerifyFailure({
      req,
      res,
      lookup,
      ...credentials,
      otpStatusUnknown: decision.otpStatusUnknown,
    });
  } catch (error: unknown) {
    return respondVerifyError({ req, res, error });
  }
};
