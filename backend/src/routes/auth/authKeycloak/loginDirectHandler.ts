import { type RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import { resolveProfile } from "./resolveProfile";

// @ts-ignore
export const loginDirectHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    // Get the OIDC client based on the request (public or intranet)
    const { client } = await getOidcClientFor(req);

    // Perform Direct Access Grant (password grant)
    // Note: This requires "Direct Access Grants Enabled" in Keycloak client settings
    const tokenSet = await client.grant({
      grant_type: "password",
      username,
      password,
      scope: "openid profile email", // Required: openid scope is mandatory for OIDC
    });

    // Get user info
    const userInfo = await client.userinfo(tokenSet.access_token!);

    // Store token and user info in session (same structure as callbackHandler)
    req.session.auth = {
      tokenSet,
      userInfo,
    };

    // Store profile in session for consistency
    const profileKey = resolveProfile(req);
    // @ts-ignore
    req.session.oidcProfile = profileKey;

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        username: userInfo.preferred_username || userInfo.email,
        name: userInfo.name,
        email: userInfo.email,
      },
    });
  } catch (error: any) {
    console.error("[auth/loginDirect] FAILED", {
      message: error?.message,
      stack: error?.stack,
    });

    // Handle specific error types
    if (
      error?.error === "invalid_grant" ||
      error?.error === "unauthorized_client"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV !== "production" ? error?.message : undefined,
    });
  }
};
