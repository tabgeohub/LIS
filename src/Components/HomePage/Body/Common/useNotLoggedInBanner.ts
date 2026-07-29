import { useMemo, useRef, useState } from "react";
import { useAuth } from "hooks/zustand/ui";
import { useContent } from "hooks/useContent";
import { resolveLoginBannerTheme } from "./notLoggedInBannerTheme";
import {
  loginRedirect,
  logoutRequest,
  resolveBannerKind,
} from "./notLoggedInAuthHelpers";
import {
  useLoginBannerFocus,
  useLoginBannerVisibility,
} from "./useLoginBannerEffects";

export function useNotLoggedInBanner() {
  const { user, setUser } = useAuth();
  const [show, setShow] = useState(true);
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);
  const content = useContent();
  const kind = useMemo(
    () => resolveBannerKind(user),
    [user.user_id, user.role]
  );

  useLoginBannerVisibility(kind, setShow);
  useLoginBannerFocus(show, primaryBtnRef);

  const theme = useMemo(() => {
    if (!kind) return null;
    return resolveLoginBannerTheme({
      kind,
      content,
      onLogin: loginRedirect,
      onLogout: () => logoutRequest(setUser),
    });
  }, [kind, content, setUser]);

  return { show, kind, theme, primaryBtnRef };
}
