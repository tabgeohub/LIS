import { MutableRefObject, RefObject } from "react";

function copyScrollLeft(from: HTMLDivElement, to: HTMLDivElement) {
  to.scrollLeft = from.scrollLeft;
}

export const syncScrollPositions = (input: {
  source: "top" | "table";
  topScrollRef: RefObject<HTMLDivElement>;
  tableScrollRef: RefObject<HTMLDivElement>;
  syncingRef: MutableRefObject<boolean>;
}) => {
  const top = input.topScrollRef.current;
  const table = input.tableScrollRef.current;
  if (!top || !table || input.syncingRef.current) return;

  input.syncingRef.current = true;

  if (input.source === "top") {
    copyScrollLeft(top, table);
  } else {
    copyScrollLeft(table, top);
  }

  window.requestAnimationFrame(() => {
    input.syncingRef.current = false;
  });
};
