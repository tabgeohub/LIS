import type { RequestHandler } from "express";
import { getOidcClientFor } from "../auth/oidc";
import { attemptPasswordGrant, classifyGrantFailure } from "./grantHelpers";
import {
  invalidCredentialsResponse,
  invalidPasswordResponse,
  invalidUsernameResponse,
} from "./authErrorResponses";
import { hashUsername, logAuthSecurityEvent } from "./authSecurityLog";
import { lookupKeycloakUser } from "./keycloakUserLookup";
import { persistLoginSession } from "./persistLoginSession";
import { parseVerifyInput } from "./validateLoginInput";

function buildUserPayload(userInfo: {
  preferred_username?: string;
  email?: string;
  name?: string;
}) {
  return {
    username: userInfo.preferred_username || userInfo.email,
    name: userInfo.name,
    email: userInfo.email,
  };
}

/**
 * Step 1 of desktop login.
 *
 * OTP-enabled users: username + hasOtp check only — password is NOT validated here.
 * Non-OTP users: password grant validates credentials in this step.
 */
export const verifyCredentialsHandler: RequestHandler = async (req, res) => {
  const parsed = parseVerifyInput(req.body);

  if (!parsed) {
    return res.status(400).json({
      success: false,
      status: "invalid_credentials",
      code: "MISSING_FIELDS",
      message: "Username and password are required",
    });
  }

  const { username, password } = parsed;

  try {
    const lookup = await lookupKeycloakUser(req, username);

    if (!lookup.ok && lookup.reason === "not_found") {
      logAuthSecurityEvent(
        "auth2.verify.invalid_username",
        { usernameHash: hashUsername(username) },
        req
      );
      return res.status(401).json(invalidUsernameResponse());
    }

    if (!lookup.ok && lookup.reason === "lookup_unavailable") {
      logAuthSecurityEvent(
        "auth2.verify.lookup_unavailable",
        { usernameHash: hashUsername(username) },
        req
      );
      return res.status(401).json(invalidCredentialsResponse());
    }

    if (lookup.ok && lookup.hasOtp === true) {
      logAuthSecurityEvent(
        "auth2.verify.otp_required",
        { usernameHash: hashUsername(username), hasOtp: true },
        req
      );

      return res.json({
        success: true,
        status: "otp_required",
        message: "Authenticator-code is required",
      });
    }

    const { client } = await getOidcClientFor(req);

    try {
      const tokenSet = await attemptPasswordGrant(client, { username, password });
      const userInfo = await client.userinfo(tokenSet.access_token!);
      await persistLoginSession({ req, tokenSet, userInfo });

      return res.json({
        success: true,
        status: "authenticated",
        message: "Login successful",
        user: buildUserPayload(userInfo),
      });
    } catch (grantError: unknown) {
      const kind = classifyGrantFailure(grantError, { otpWasSent: false });

      if (kind === "otp_required") {
        return res.json({
          success: true,
          status: "otp_required",
          message: "Authenticator-code is required",
        });
      }

      logAuthSecurityEvent(
        "auth2.verify.invalid_password",
        {
          usernameHash: hashUsername(username),
          hasOtp: lookup.ok ? lookup.hasOtp : "lookup_unavailable",
          grantFailureKind: kind,
          message: (grantError as Error)?.message,
        },
        req
      );

      return res.status(401).json(invalidPasswordResponse());
    }
  } catch (error: unknown) {
    logAuthSecurityEvent(
      "auth2.verify.error",
      { message: (error as Error)?.message },
      req
    );

    return res.status(500).json({
      success: false,
      status: "error",
      message: "Login failed",
      error:
        process.env.NODE_ENV !== "production"
          ? (error as Error)?.message
          : undefined,
    });
  }
};
