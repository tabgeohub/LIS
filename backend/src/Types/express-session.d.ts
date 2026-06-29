import "express-session";
import type { TokenSet } from "openid-client";

declare module "express-session" {
  interface SessionData {
    state?: string;
    nonce?: string;
    /** Relative path (+ query) to open after OIDC callback, e.g. /images?kind=point&... */
    afterLoginRedirect?: string;
    /** Validated path consumed by the SPA via /auth/me after callback (not used in res.redirect). */
    pendingClientPath?: string;
    auth?: {
      tokenSet: TokenSet;
      userInfo: Record<string, any>;
    };
  }
}
