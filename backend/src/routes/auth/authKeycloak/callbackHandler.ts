import { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import {
  getFixedPostLoginRedirectUrl,
  storePendingClientRedirect,
} from "./resolvePostLoginRedirect";

// @ts-ignore
export const callbackHandler: RequestHandler = async (req, res) => {
  try {
    // @ts-ignore
    const profileKey = req.session.oidcProfile || "public";
    const { client, appBaseUrl } = await getOidcClientFor(req);

    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      `${appBaseUrl}/auth/callback`,
      params,
      {
        state: req.session.state,
        nonce: req.session.nonce,
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token!);
    req.session.auth = { tokenSet, userInfo };

    // @ts-ignore
    const mode = req.session.loginMode || "web";
    delete req.session.state;
    delete req.session.nonce;
    // @ts-ignore
    delete req.session.loginMode;

    if (mode === "desktop") {
      return res.redirect("/auth/desktop-ok");
    }

    const rawAfterLogin = req.session.afterLoginRedirect;
    delete req.session.afterLoginRedirect;
    storePendingClientRedirect(req.session, rawAfterLogin);

    return res.redirect(getFixedPostLoginRedirectUrl(profileKey));
  } catch (err) {
    console.error("OIDC callback error >>>", err);
    return res.status(400).send("OIDC callback failed");
  }
};
