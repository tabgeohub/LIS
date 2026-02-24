import { useState, useEffect, RefObject } from "react";

export const useHeaderHeight = (headerRef: RefObject<HTMLDivElement>) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setHeaderHeight(entry.contentRect.height);
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [headerRef]);

  return headerHeight;
};

