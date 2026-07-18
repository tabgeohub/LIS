import type { Request } from "express";
import { newNonce, newState } from "../oidc";
import { safeReturnPath } from "./safeReturnPath";

export function prepareLoginSession(
  req: Request,
  profileKey: string
): { state: string; nonce: string } | { error: string } {
  if (!req.session) {
    console.error("[auth/login] req.session missing");
    return { error: "Session not available" };
  }

  const state = newState();
  const nonce = newNonce();
  req.session.state = state;
  req.session.nonce = nonce;
  // @ts-ignore
  req.session.oidcProfile = profileKey;
  // @ts-ignore
  req.session.loginMode = req.query.mode === "desktop" ? "desktop" : "web";

  const returnTo = safeReturnPath(req.query.return_to);
  if (returnTo) {
    req.session.afterLoginRedirect = returnTo;
  }

  return { state, nonce };
}

export function buildLoginAuthUrl(input: {
  client: { authorizationUrl: (params: Record<string, string>) => string };
  appBaseUrl: string;
  state: string;
  nonce: string;
}) {
  return input.client.authorizationUrl({
    scope: "openid profile email",
    redirect_uri: `${input.appBaseUrl}/auth/callback`,
    state: input.state,
    nonce: input.nonce,
  });
}
