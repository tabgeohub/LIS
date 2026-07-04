import type { Request } from "express";
import type { TokenSet, UserinfoResponse } from "openid-client";
import { resolveProfile } from "./resolveProfile";

export function persistDirectLoginSession(input: {
  req: Request;
  tokenSet: TokenSet;
  userInfo: UserinfoResponse;
}): void {
  const { req, tokenSet, userInfo } = input;
  req.session.auth = { tokenSet, userInfo };
  // @ts-ignore
  req.session.oidcProfile = resolveProfile(req);
}
