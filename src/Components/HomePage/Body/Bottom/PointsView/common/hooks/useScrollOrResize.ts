import { useEffect } from "react";

export const useScrollOrResize = (
  setClickedPointPosition: (position: null) => void
) => {
  useEffect(() => {
    const handleScrollOrResize = () => setClickedPointPosition(null);
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [setClickedPointPosition]);
};

