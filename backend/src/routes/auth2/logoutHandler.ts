import type { RequestHandler } from "express";
import { getOidcClientFor } from "../auth/oidc";
import { logAuthSecurityEvent } from "./authSecurityLog";

export const logoutHandler: RequestHandler = async (req, res) => {
  try {
    const { client } = await getOidcClientFor(req);
    const tokens = req.session.auth;

    try {
      if (tokens?.tokenSet?.refresh_token) {
        await client.revoke(tokens.tokenSet.refresh_token, "refresh_token");
      }
    } catch {
      // Best-effort revoke; still destroy local session.
    }

    req.session.destroy(() => {
      logAuthSecurityEvent({ event: "auth2.logout.success", meta: {}, req });
      res.json({ success: true });
    });
  } catch (error) {
    logAuthSecurityEvent({
      event: "auth2.logout.error",
      meta: { message: (error as Error)?.message },
      req,
    });
    req.session.destroy(() => {
      res.json({ success: true });
    });
  }
};
