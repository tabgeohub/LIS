import type { Request } from "express";
import type { TokenSet, UserinfoResponse } from "openid-client";
import { resolveProfile } from "../auth/authKeycloak/resolveProfile";

/**
 * Stores auth in the session after login. Regenerates the session id first to
 * mitigate session fixation (new session cookie issued on successful login).
 */
export async function persistLoginSession(input: {
  req: Request;
  tokenSet: TokenSet;
  userInfo: UserinfoResponse;
}): Promise<void> {
  const { req, tokenSet, userInfo } = input;

  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        reject(regenerateError);
        return;
      }

      req.session.auth = { tokenSet, userInfo };
      // @ts-ignore — oidcProfile used by getOidcClientFor on refresh/logout
      req.session.oidcProfile = resolveProfile(req);

      req.session.save((saveError) => {
        if (saveError) {
          reject(saveError);
          return;
        }
        resolve();
      });
    });
  });
}
