import type { Request, Response } from "express";
import {
  getFixedPostLoginRedirectUrl,
  storePendingClientRedirect,
} from "./resolvePostLoginRedirect";
import { safeServerRedirect } from "./safeServerRedirect";

export function resolveCallbackRedirect(req: Request, res: Response): void {
  // @ts-ignore
  const profileKey = req.session.oidcProfile || "public";
  // @ts-ignore
  const mode = req.session.loginMode || "web";

  delete req.session.state;
  delete req.session.nonce;
  // @ts-ignore
  delete req.session.loginMode;

  if (mode === "desktop") {
    safeServerRedirect(res, "/auth/desktop-ok");
    return;
  }

  const rawAfterLogin = req.session.afterLoginRedirect;
  delete req.session.afterLoginRedirect;
  storePendingClientRedirect(req.session, rawAfterLogin);
  safeServerRedirect(res, getFixedPostLoginRedirectUrl(profileKey));
}
