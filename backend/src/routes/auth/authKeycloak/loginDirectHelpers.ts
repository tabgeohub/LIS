import type { Request, Response } from "express";
import { getOidcClientFor } from "../oidc";
import { mapDirectLoginError } from "./mapDirectLoginError";
import { persistDirectLoginSession } from "./persistDirectLoginSession";

export function requireDirectLoginCredentials(
  req: Request,
  res: Response
): { username: string; password: string } | null {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
    return null;
  }
  return { username, password };
}

export async function performDirectLogin(
  req: Request,
  credentials: { username: string; password: string }
) {
  const { client } = await getOidcClientFor(req);
  const tokenSet = await client.grant({
    grant_type: "password",
    username: credentials.username,
    password: credentials.password,
    scope: "openid profile email",
  });

  const userInfo = await client.userinfo(tokenSet.access_token!);
  persistDirectLoginSession({ req, tokenSet, userInfo });

  return {
    success: true as const,
    message: "Login successful",
    user: {
      username: userInfo.preferred_username || userInfo.email,
      name: userInfo.name,
      email: userInfo.email,
    },
  };
}

export function sendDirectLoginError(res: Response, error: unknown): void {
  console.error("[auth/loginDirect] FAILED", {
    message: (error as Error)?.message,
    stack: (error as Error)?.stack,
  });
  const { status, body } = mapDirectLoginError(error);
  res.status(status).json(body);
}
