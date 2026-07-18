// routes/auth/authKeycloak/authHandlers/loginHandler.ts
import type { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import { resolveProfile } from "./resolveProfile";
import {
  buildLoginAuthUrl,
  prepareLoginSession,
} from "./loginHandlerHelpers";

// @ts-ignore
export const loginHandler: RequestHandler = async (req, res) => {
  const profileKey = resolveProfile(req); // "public" | "intranet"
  try {
    const { client, appBaseUrl } = await getOidcClientFor(req);
    const session = prepareLoginSession(req, profileKey);
    if ("error" in session) {
      return res.status(500).send(session.error);
    }

    return res.redirect(
      buildLoginAuthUrl({
        client,
        appBaseUrl,
        state: session.state,
        nonce: session.nonce,
      })
    );
  } catch (e: any) {
    console.error("[auth/login] FAILED profile=%s", profileKey, {
      message: e?.message,
      stack: e?.stack,
    });
    return res.status(500).send("Internal Server Error");
  }
};
