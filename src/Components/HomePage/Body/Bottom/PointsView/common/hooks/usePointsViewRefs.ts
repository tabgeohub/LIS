import Graphic from "@arcgis/core/Graphic";
import { useRef } from "react";

export function usePointsViewRefs() {
  return {
    popupRef: useRef<HTMLDivElement | null>(null),
    headerRef: useRef<HTMLDivElement | null>(null),
    tableScrollRef: useRef<HTMLDivElement | null>(null),
    topScrollRef: useRef<HTMLDivElement | null>(null),
    syncingRef: useRef(false),
    originalGraphicsMap: useRef<Map<number, Graphic>>(new Map()),
  };
}
