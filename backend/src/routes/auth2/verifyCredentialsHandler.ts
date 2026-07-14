import type { RequestHandler } from "express";
import { logAuthSecurityEvent } from "./authSecurityLog";
import { lookupKeycloakUser } from "./keycloakUserLookup";
import { parseVerifyInput } from "./validateLoginInput";
import { classifyVerifyLookup } from "./verifyCredentialsFlow";
import {
  authenticateOrRespondToVerifyFailure,
  respondToVerifyLookup,
} from "./verifyCredentialsResponses";

export const verifyCredentialsHandler: RequestHandler = async (req, res) => {
  const credentials = parseVerifyInput(req.body);
  if (!credentials) {
    return res.status(400).json({
      success: false,
      status: "invalid_credentials",
      code: "MISSING_FIELDS",
      message: "Username and password are required",
    });
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
    logAuthSecurityEvent("auth2.verify.error", { message: (error as Error)?.message }, req);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Login failed",
      error: process.env.NODE_ENV !== "production" ? (error as Error)?.message : undefined,
    });
  }
};
