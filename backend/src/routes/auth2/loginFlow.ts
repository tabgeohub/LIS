import type { Request, Response } from "express";
import { getOidcClientFor } from "../auth/oidc";
import {
  attemptPasswordGrant,
  classifyStep2OtpLoginFailure,
} from "./grantHelpers";
import { buildStep2LoginFailureBody, mapLoginError } from "./mapLoginError";
import { logAuthSecurityEvent } from "./authSecurityLog";
import { lookupKeycloakUser } from "./keycloakUserLookup";
import { persistLoginSession } from "./persistLoginSession";

type LoginCredentials = { username: string; password: string; otp?: string };

export async function authenticateLogin(req: Request, credentials: LoginCredentials) {
  const { client } = await getOidcClientFor(req);
  const tokenSet = await attemptPasswordGrant(client, credentials);
  const userInfo = await client.userinfo(tokenSet.access_token!);
  await persistLoginSession({ req, tokenSet, userInfo });
  return {
    username: userInfo.preferred_username || userInfo.email,
    name: userInfo.name,
    email: userInfo.email,
  };
}

type LoginFailureLog = {
  req: Request;
  error: unknown;
  otpUsed: boolean;
  status: number;
  code?: string;
  step2Kind?: string;
};

function logLoginFailure({
  req,
  error,
  otpUsed,
  status,
  code,
  step2Kind,
}: LoginFailureLog) {
  logAuthSecurityEvent("auth2.login.failure", {
    status,
    code,
    otpUsed,
    ...(step2Kind ? { step2Kind } : {}),
    message: (error as Error)?.message,
  }, req);
}

export async function respondToLoginFailure(input: {
  req: Request;
  res: Response;
  error: unknown;
  credentials: LoginCredentials;
}) {
  const { req, res, error, credentials } = input;
  const otpUsed = Boolean(credentials.otp);
  if (credentials.otp) {
    const lookup = await lookupKeycloakUser(req, credentials.username);
    if (lookup.ok && lookup.hasOtp === true) {
      const kind = classifyStep2OtpLoginFailure(error, {
        hasOtp: true,
        otpWasSent: true,
        loginStep: "otp",
      });
      const body = buildStep2LoginFailureBody(kind);
      logLoginFailure({
        req,
        error,
        otpUsed: true,
        status: 401,
        code: body.code,
        step2Kind: kind,
      });
      return res.status(401).json(body);
    }
  }

  const lookupForDebug = credentials.otp
    ? await lookupKeycloakUser(req, credentials.username)
    : null;
  const { status, body } = mapLoginError(error, {
    otpWasSent: otpUsed,
    loginStep: otpUsed ? "otp" : "password",
    hasOtp: lookupForDebug?.ok ? lookupForDebug.hasOtp : null,
  });
  logLoginFailure({ req, error, otpUsed, status, code: body.code });
  return res.status(status).json(body);
}
