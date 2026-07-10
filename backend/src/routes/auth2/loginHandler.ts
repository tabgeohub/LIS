import type { RequestHandler } from "express";
import { getOidcClientFor } from "../auth/oidc";
import {
  buildStep2LoginFailureBody,
  mapLoginError,
} from "./mapLoginError";
import {
  attemptPasswordGrant,
  classifyStep2OtpLoginFailure,
} from "./grantHelpers";
import { logAuthSecurityEvent } from "./authSecurityLog";
import { lookupKeycloakUser } from "./keycloakUserLookup";
import { persistLoginSession } from "./persistLoginSession";
import { parseLoginInput } from "./validateLoginInput";

export const loginHandler: RequestHandler = async (req, res) => {
  const parsed = parseLoginInput(req.body);

  if (!parsed) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  const { username, password, otp } = parsed;

  try {
    const { client } = await getOidcClientFor(req);
    const tokenSet = await attemptPasswordGrant(client, {
      username,
      password,
      otp,
    });

    const userInfo = await client.userinfo(tokenSet.access_token!);
    await persistLoginSession({ req, tokenSet, userInfo });

    logAuthSecurityEvent("auth2.login.success", { otpUsed: Boolean(otp) }, req);

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        username: userInfo.preferred_username || userInfo.email,
        name: userInfo.name,
        email: userInfo.email,
      },
    });
  } catch (error: unknown) {
    if (otp) {
      const lookup = await lookupKeycloakUser(req, username);

      if (lookup.ok && lookup.hasOtp === true) {
        const step2Kind = classifyStep2OtpLoginFailure(error, {
          hasOtp: lookup.hasOtp,
          otpWasSent: true,
          loginStep: "otp",
        });
        const body = buildStep2LoginFailureBody(step2Kind);

        logAuthSecurityEvent(
          "auth2.login.failure",
          {
            status: 401,
            code: body.code,
            otpUsed: true,
            step2Kind,
            message: (error as Error)?.message,
          },
          req
        );

        return res.status(401).json(body);
      }
    }

    const loginStep = otp ? "otp" : "password";
    const lookupForDebug = otp ? await lookupKeycloakUser(req, username) : null;
    const { status, body } = mapLoginError(error, {
      otpWasSent: Boolean(otp),
      loginStep,
      hasOtp: lookupForDebug?.ok ? lookupForDebug.hasOtp : null,
    });

    logAuthSecurityEvent(
      "auth2.login.failure",
      {
        status,
        code: body.code,
        otpUsed: Boolean(otp),
        message: (error as Error)?.message,
      },
      req
    );

    return res.status(status).json(body);
  }
};
