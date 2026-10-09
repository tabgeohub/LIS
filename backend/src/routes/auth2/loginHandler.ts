import type { RequestHandler } from "express";
import { logAuthSecurityEvent } from "./authSecurityLog";
import { authenticateLogin, respondToLoginFailure } from "./loginFlow";
import { parseLoginInput } from "./validateLoginInput";
import { isAuth2IdentityUnavailableError } from "./authIdentity";

export const loginHandler: RequestHandler = async (req, res) => {
  const credentials = parseLoginInput(req.body);
  if (!credentials) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const user = await authenticateLogin(req, credentials);
    logAuthSecurityEvent({
      event: "auth2.login.success",
      meta: { otpUsed: Boolean(credentials.otp) },
      req,
    });
    return res.json({
      success: true,
      message: "Login successful",
      user,
      identity: req.session.auth?.identity ?? null,
    });
  } catch (error: unknown) {
    if (isAuth2IdentityUnavailableError(error)) {
      return res.status(502).json({
        success: false,
        code: "IDENTITY_UNAVAILABLE",
        message: "Authenticated Keycloak response is missing a valid subject",
      });
    }
    return respondToLoginFailure({ req, res, error, credentials });
  }
};
