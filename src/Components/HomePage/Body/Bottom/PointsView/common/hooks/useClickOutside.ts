import { useEffect, RefObject } from "react";

export const useClickOutside = (
  popupRef: RefObject<HTMLDivElement>,
  setClickedPoint: (point: undefined) => void,
  setClickedPointPosition: (position: null) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setClickedPoint(undefined);
        setClickedPointPosition(null);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef, setClickedPoint, setClickedPointPosition]);
};

