import { RefObject, useEffect } from "react";

export function useResultTabPopupDismiss(input: {
  popupRef: RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
}) {
  const { popupRef, onDismiss } = input;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onDismiss();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [popupRef, onDismiss]);

  useEffect(() => {
    const handleScrollOrResize = () => onDismiss();
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [onDismiss]);
}
