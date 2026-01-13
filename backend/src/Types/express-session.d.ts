import "express-session";
import type { TokenSet } from "openid-client";

declare module "express-session" {
  interface SessionData {
    state?: string;
    nonce?: string;
    auth?: {
      tokenSet: TokenSet;
      userInfo: Record<string, any>;
    };
  }
}
