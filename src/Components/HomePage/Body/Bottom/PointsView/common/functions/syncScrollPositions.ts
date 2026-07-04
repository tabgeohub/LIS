import { RefObject } from "react";

export const syncScrollPositions = (input: {
  source: "top" | "table";
  topScrollRef: RefObject<HTMLDivElement>;
  tableScrollRef: RefObject<HTMLDivElement>;
  syncingRef: RefObject<boolean>;
}) => {
  if (!input.topScrollRef.current || !input.tableScrollRef.current) return;
  if (input.syncingRef.current) return;
  input.syncingRef.current = true;

  if (input.source === "top") {
    input.tableScrollRef.current.scrollLeft = input.topScrollRef.current.scrollLeft;
  } else {
    input.topScrollRef.current.scrollLeft = input.tableScrollRef.current.scrollLeft;
  }

  window.requestAnimationFrame(() => {
    if (input.syncingRef.current !== null) {
      input.syncingRef.current = false;
    }
  });
};
