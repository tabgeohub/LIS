import type { Request, Response } from "express";
import {
  getFixedPostLoginRedirectUrl,
  storePendingClientRedirect,
} from "./resolvePostLoginRedirect";

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
    res.redirect("/auth/desktop-ok");
    return;
  }

  const rawAfterLogin = req.session.afterLoginRedirect;
  delete req.session.afterLoginRedirect;
  storePendingClientRedirect(req.session, rawAfterLogin);
  res.redirect(getFixedPostLoginRedirectUrl(profileKey));
}
