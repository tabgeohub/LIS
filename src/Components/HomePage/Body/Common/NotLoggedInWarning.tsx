/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from "framer-motion";
import { useNotLoggedInBanner } from "./useNotLoggedInBanner";
import { LoginBannerOverlay } from "./LoginBannerOverlay";

export default function NotLoggedInWarning() {
  const { show, kind, theme, primaryBtnRef } = useNotLoggedInBanner();

  return (
    <AnimatePresence>
      {show && kind && theme && (
        <LoginBannerOverlay theme={theme} primaryBtnRef={primaryBtnRef} />
      )}
    </AnimatePresence>
  );
}
