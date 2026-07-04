import { useEffect, RefObject } from "react";

type UseClickOutsideInput = {
  popupRef: RefObject<HTMLDivElement>;
  setClickedPoint: (point: undefined) => void;
  setClickedPointPosition: (position: null) => void;
};

export const useClickOutside = (input: UseClickOutsideInput) => {
  const { popupRef, setClickedPoint, setClickedPointPosition } = input;

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
