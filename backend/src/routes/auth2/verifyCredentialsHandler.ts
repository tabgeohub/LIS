import type { RequestHandler } from "express";
import { getOidcClientFor } from "../auth/oidc";
import { attemptPasswordGrant, classifyGrantFailure } from "./grantHelpers";
import {
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

    // OTP status is "unknown" when the Keycloak admin lookup could not tell us:
    // the admin API was unavailable, or the per-user credentials call failed
    // (hasOtp === null). In that case we must NOT assume the user has no OTP —
    // doing so is what caused correct-password OTP users to be told the password
    // was wrong and never reach step 2 during admin-API blips.
    const otpStatusUnknown = !lookup.ok || lookup.hasOtp === null;

    if (!lookup.ok && lookup.reason === "lookup_unavailable") {
      logAuthSecurityEvent(
        "auth2.verify.lookup_unavailable",
        { usernameHash: hashUsername(username) },
        req
      );
      // Fall through to a password-grant attempt instead of failing outright:
      // non-OTP users can still log in, and OTP users can still be routed to
      // step 2 via the ambiguous-grant handling below.
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

      // Route to the OTP step when Keycloak explicitly asks for it, OR when we
      // could not determine the user's OTP status and the password-only grant
      // failed with an ambiguous invalid_grant — which is exactly what Keycloak
      // returns when a required OTP is missing. This keeps OTP users flowing to
      // step 2 even while the admin lookup is degraded. (Tradeoff: a non-OTP
      // user with a genuinely wrong password is sent to step 2, where the next
      // grant rejects them correctly.)
      const ambiguousGrant =
        kind === "ambiguous_invalid_grant" || kind === "unknown";

      if (kind === "otp_required" || (otpStatusUnknown && ambiguousGrant)) {
        logAuthSecurityEvent(
          "auth2.verify.otp_required",
          {
            usernameHash: hashUsername(username),
            hasOtp: lookup.ok ? lookup.hasOtp : "lookup_unavailable",
            grantFailureKind: kind,
            inferred: kind !== "otp_required",
          },
          req
        );

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
