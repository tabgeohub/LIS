import type { Request, Response } from "express";
import { classifyStep2OtpLoginFailure } from "./grantHelpers";
import { buildStep2LoginFailureBody, mapLoginError } from "./mapLoginError";
import { logAuthSecurityEvent } from "./authSecurityLog";
import { lookupKeycloakUser } from "./keycloakUserLookup";

type LoginCredentials = { username: string; password: string; otp?: string };

type LoginFailureLog = {
  req: Request;
  error: unknown;
  otpUsed: boolean;
  status: number;
  code?: string;
  step2Kind?: string;
};

export function logLoginFailure({
  req,
  error,
  otpUsed,
  status,
  code,
  step2Kind,
}: LoginFailureLog) {
  logAuthSecurityEvent({
    event: "auth2.login.failure",
    meta: {
      status,
      code,
      otpUsed,
      ...(step2Kind ? { step2Kind } : {}),
      message: (error as Error)?.message,
    },
    req,
  });
}

type Step2OtpFailureInput = {
  req: Request;
  res: Response;
  error: unknown;
  username: string;
};

export async function respondToStep2OtpFailure(
  input: Step2OtpFailureInput
): Promise<boolean> {
  const { req, res, error, username } = input;
  const lookup = await lookupKeycloakUser(req, username);
  if (!lookup.ok || lookup.hasOtp !== true) return false;

  const kind = classifyStep2OtpLoginFailure(error, {
    hasOtp: true,
    otpWasSent: true,
    loginStep: "otp",
  });
  const body = buildStep2LoginFailureBody(kind);
  logLoginFailure({
    req, error, otpUsed: true, status: 401, code: body.code, step2Kind: kind,
  });
  res.status(401).json(body);
  return true;
}

type MappedLoginFailureInput = {
  req: Request;
  res: Response;
  error: unknown;
  credentials: LoginCredentials;
};

export async function respondToMappedLoginFailure(
  input: MappedLoginFailureInput
): Promise<void> {
  const { req, res, error, credentials } = input;
  const otpUsed = Boolean(credentials.otp);
  const lookupForDebug = credentials.otp
    ? await lookupKeycloakUser(req, credentials.username)
    : null;
  const { status, body } = mapLoginError(error, {
    otpWasSent: otpUsed,
    loginStep: otpUsed ? "otp" : "password",
    hasOtp: lookupForDebug?.ok ? lookupForDebug.hasOtp : null,
  });
  logLoginFailure({ req, error, otpUsed, status, code: body.code });
  res.status(status).json(body);
}
