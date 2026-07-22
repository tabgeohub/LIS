import { RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";

function resolveLogoutProfile(origin: string | undefined): "intranet" | "public" {
  return origin?.includes(".intranet.") ? "intranet" : "public";
}

function resolveLogoutRedirect(profile: "intranet" | "public"): string {
  return profile === "intranet"
    ? process.env.INTRANET_FRONTEND_URL!
    : process.env.PUBLIC_FRONTEND_URL!;
}

async function revokeRefreshTokenIfPresent(
  client: { revoke: (token: string, type: string) => Promise<unknown> },
  tokens: { tokenSet?: { refresh_token?: string } } | undefined
): Promise<void> {
  const refreshToken = tokens?.tokenSet?.refresh_token;
  if (!refreshToken) return;
  try {
    await client.revoke(refreshToken, "refresh_token");
  } catch {
    // ignore revoke failures during logout
  }
}

export const logoutHandler: RequestHandler = async (req, res) => {
  try {
    const profile = resolveLogoutProfile(req.headers.origin);
    // @ts-ignore
    const profileKey = req.session.oidcProfile || "public";
    const { client } = await getOidcClientFor(profileKey);
    const redirectBack = resolveLogoutRedirect(profile);

    await revokeRefreshTokenIfPresent(client, req.session.auth);
    req.session.destroy(() => res.json({ redirect: redirectBack }));
  } catch (err) {
    console.error("Logout error:", err);
    req.session.destroy(() => res.json({ redirect: "/" }));
  }
};
