import { useEffect, RefObject } from "react";

export const useClickOutside = (
  popupRef: RefObject<HTMLDivElement>,
  setClickedPoint: (point: undefined) => void,
  setClickedPointPosition: (position: null) => void,
  setClickedGeometry?: (geometry: undefined) => void,
  setClickedGeometryPosition?: (position: null) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setClickedPoint(undefined);
        setClickedPointPosition(null);
        if (setClickedGeometry) setClickedGeometry(undefined);
        if (setClickedGeometryPosition) setClickedGeometryPosition(null);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    popupRef,
    setClickedPoint,
    setClickedPointPosition,
    setClickedGeometry,
    setClickedGeometryPosition,
  ]);
};

