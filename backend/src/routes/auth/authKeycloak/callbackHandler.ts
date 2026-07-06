import { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import { resolveCallbackRedirect } from "./resolveCallbackRedirect";
import { getOidcProfile } from "./resolvePostLoginRedirect";

// @ts-ignore
export const callbackHandler: RequestHandler = async (req, res) => {
  try {
    const { client, profile } = await getOidcClientFor(req);
    const callbackUrl = `${getOidcProfile(profile).appBaseUrl}/auth/callback`;
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      callbackUrl,
      params,
      {
        state: req.session.state,
        nonce: req.session.nonce,
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token!);
    req.session.auth = { tokenSet, userInfo };
    resolveCallbackRedirect(req, res);
  } catch (err) {
    console.error("OIDC callback error >>>", err);
    return res.status(400).send("OIDC callback failed");
  }
};
