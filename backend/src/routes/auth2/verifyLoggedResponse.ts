import type { Request, Response } from "express";
import { hashUsername, logAuthSecurityEvent } from "./authSecurityLog";

export const OTP_REQUIRED_RESPONSE = {
  success: true,
  status: "otp_required",
  message: "Authenticator-code is required",
};

export function logVerifyEvent(input: {
  req: Request;
  event: string;
  username: string;
  meta?: Record<string, unknown>;
}) {
  logAuthSecurityEvent({
    event: input.event,
    meta: { usernameHash: hashUsername(input.username), ...input.meta },
    req: input.req,
  });
}

function jsonVerifyResponse(options: {
  res: Response;
  status: number | undefined;
  body: object;
}) {
  return options.status === undefined
    ? options.res.json(options.body)
    : options.res.status(options.status).json(options.body);
}

export function respondLoggedVerify(input: {
  req: Request;
  res: Response;
  username: string;
  event: string;
  meta?: Record<string, unknown>;
  status?: number;
  body: object;
}) {
  logVerifyEvent({
    req: input.req,
    event: input.event,
    username: input.username,
    meta: input.meta,
  });
  return jsonVerifyResponse({
    res: input.res,
    status: input.status,
    body: input.body,
  });
}
