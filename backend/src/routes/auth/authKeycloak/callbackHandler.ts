import { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import { OIDC_PROFILES } from "../oidcProfiles";

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

    if (mode === "desktop") return res.redirect("/auth/desktop-ok");

    const afterPath = req.session.afterLoginRedirect;
    delete req.session.afterLoginRedirect;

    const base = OIDC_PROFILES[profileKey].frontendUrl.replace(/\/$/, "");
    if (typeof afterPath === "string" && afterPath.startsWith("/")) {
      return res.redirect(`${base}${afterPath}`);
    }

    return res.redirect(OIDC_PROFILES[profileKey].frontendUrl);
  } catch (err) {
    console.error("OIDC callback error >>>", err);
    return res.status(400).send("OIDC callback failed");
  }
};
