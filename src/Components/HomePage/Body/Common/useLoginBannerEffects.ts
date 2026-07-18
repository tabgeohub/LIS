import { useEffect, type MutableRefObject } from "react";
import type { BannerKind } from "./notLoggedInAuthHelpers";

export function useLoginBannerVisibility(
  kind: BannerKind,
  setShow: (show: boolean) => void
) {
  useEffect(() => {
    const shouldShow = !!kind;
    setShow(shouldShow);
    if (!shouldShow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [kind, setShow]);
}

export function useLoginBannerFocus(
  show: boolean,
  primaryBtnRef: MutableRefObject<HTMLButtonElement | null>
) {
  useEffect(() => {
    if (!show) return;
    const id = requestAnimationFrame(() => primaryBtnRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [show, primaryBtnRef]);
}
