import { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import { resolveCallbackRedirect } from "./resolveCallbackRedirect";

// @ts-ignore
export const callbackHandler: RequestHandler = async (req, res) => {
  try {
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
    resolveCallbackRedirect(req, res);
  } catch (err) {
    console.error("OIDC callback error >>>", err);
    return res.status(400).send("OIDC callback failed");
  }
};
