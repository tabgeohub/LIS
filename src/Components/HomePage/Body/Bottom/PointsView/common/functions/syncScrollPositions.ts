import { RefObject } from "react";

export const syncScrollPositions = (
  source: "top" | "table",
  topScrollRef: RefObject<HTMLDivElement>,
  tableScrollRef: RefObject<HTMLDivElement>,
  syncingRef: RefObject<boolean>
) => {
  if (!topScrollRef.current || !tableScrollRef.current) return;
  if (syncingRef.current) return;
  syncingRef.current = true;

  if (source === "top") {
    tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
  } else {
    topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
  }

  window.requestAnimationFrame(() => {
    if (syncingRef.current !== null) {
      syncingRef.current = false;
    }
  });
};

