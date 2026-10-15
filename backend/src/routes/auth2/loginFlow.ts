import type { Request, Response } from "express";
import { getOidcClientFor } from "../auth/oidc";
import { attemptPasswordGrant } from "./grantHelpers";
import { persistLoginSession } from "./persistLoginSession";
import {
  respondToMappedLoginFailure,
  respondToStep2OtpFailure,
} from "./loginFlowHelpers";

type LoginCredentials = { username: string; password: string; otp?: string };

export async function authenticateLogin(req: Request, credentials: LoginCredentials) {
  const { client } = await getOidcClientFor(req);
  const tokenSet = await attemptPasswordGrant({ client, ...credentials });
  const userInfo = await client.userinfo(tokenSet.access_token!);
  await persistLoginSession({ req, tokenSet, userInfo });
  return {
    username: userInfo.preferred_username || userInfo.email,
    name: userInfo.name,
    email: userInfo.email,
  };
}

export async function respondToLoginFailure(input: {
  req: Request;
  res: Response;
  error: unknown;
  credentials: LoginCredentials;
}) {
  const { req, res, error, credentials } = input;
  if (credentials.otp) {
    const handled = await respondToStep2OtpFailure({
      req,
      res,
      error,
      username: credentials.username,
    });
    if (handled) return res;
  }
  await respondToMappedLoginFailure({ req, res, error, credentials });
  return res;
}
