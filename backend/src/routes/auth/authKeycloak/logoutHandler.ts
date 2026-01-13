import { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";

export const logoutHandler: RequestHandler = async (req, res) => {
  try {
    const profile = req.headers.origin?.includes(".intranet.")
      ? "intranet"
      : "public";

    // @ts-ignore
    const profileKey = req.session.oidcProfile || "public";
    const { client } = await getOidcClientFor(profileKey);
    const redirectBack =
      profile === "intranet"
        ? process.env.INTRANET_FRONTEND_URL!
        : process.env.PUBLIC_FRONTEND_URL!;

    const tokens = req.session.auth;
    try {
      if (tokens?.tokenSet?.refresh_token) {
        await client.revoke(tokens.tokenSet.refresh_token, "refresh_token");
      }
    } catch {}

    req.session.destroy(() => res.json({ redirect: redirectBack }));
  } catch (err) {
    console.error("Logout error:", err);
    req.session.destroy(() => res.json({ redirect: "/" }));
  }
};
