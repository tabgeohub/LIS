// routes/auth/authKeycloak/authHandlers/loginHandler.ts
import type { RequestHandler } from "express";
import { getOidcClientFor, newNonce, newState } from "../oidc";
import { resolveProfile } from "./resolveProfile";

// @ts-ignore
export const loginHandler: RequestHandler = async (req, res) => {
  const profileKey = resolveProfile(req); // "public" | "intranet"
  try {
    const { client, appBaseUrl } = await getOidcClientFor(req);

    const state = newState();
    const nonce = newNonce();

    // session precheck — helps catch cookie/proxy issues
    if (!req.session) {
      console.error("[auth/login] req.session missing");
      return res.status(500).send("Session not available");
    }

    req.session.state = state;
    req.session.nonce = nonce;
    // @ts-ignore
    req.session.oidcProfile = profileKey;
    // @ts-ignore
    req.session.loginMode = req.query.mode === "desktop" ? "desktop" : "web";

    const redirectUri = `${appBaseUrl}/auth/callback`;

    const authUrl = client.authorizationUrl({
      scope: "openid profile email",
      redirect_uri: redirectUri,
      state,
      nonce,
    });

    return res.redirect(authUrl);
  } catch (e: any) {
    // LOG EVERYTHING, but do not leak secrets
    console.error("[auth/login] FAILED profile=%s", profileKey, {
      message: e?.message,
      stack: e?.stack,
    });
    return res.status(500).send("Internal Server Error");
  }
};
