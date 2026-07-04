import { type RequestHandler } from "express";
import { getOidcClientFor } from "../oidc";
import { mapDirectLoginError } from "./mapDirectLoginError";
import { persistDirectLoginSession } from "./persistDirectLoginSession";

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
    const { client } = await getOidcClientFor(req);
    const tokenSet = await client.grant({
      grant_type: "password",
      username,
      password,
      scope: "openid profile email",
    });

    const userInfo = await client.userinfo(tokenSet.access_token!);
    persistDirectLoginSession({ req, tokenSet, userInfo });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        username: userInfo.preferred_username || userInfo.email,
        name: userInfo.name,
        email: userInfo.email,
      },
    });
  } catch (error: unknown) {
    console.error("[auth/loginDirect] FAILED", {
      message: (error as Error)?.message,
      stack: (error as Error)?.stack,
    });
    const { status, body } = mapDirectLoginError(error);
    return res.status(status).json(body);
  }
};
