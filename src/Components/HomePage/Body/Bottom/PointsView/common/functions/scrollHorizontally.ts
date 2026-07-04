import { RefObject } from "react";

export const scrollHorizontally = (input: {
  direction: "left" | "right";
  tableScrollRef: RefObject<HTMLDivElement>;
  topScrollRef: RefObject<HTMLDivElement>;
}) => {
  const { direction, tableScrollRef, topScrollRef } = input;
  if (!tableScrollRef.current || !topScrollRef.current) return;
  const delta = direction === "left" ? -250 : 250;
  tableScrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
  topScrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
};
