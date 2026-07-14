import Graphic from "@arcgis/core/Graphic";
import { useRef, useState } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";

export function usePointsViewStateAndRefs() {
  const [clickedPoint, setClickedPoint] = useState<EnrichedPointType>();
  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
  const [starredPlans, setStarredPlans] = useState<FlightPlanType[]>([]);
  const [starredGeometries, setStarredGeometries] = useState<any[]>([]);
  const [tab, setTab] = useState("points");

  return {
    state: {
      tab,
      setTab,
      clickedPoint,
      setClickedPoint,
      clickedPointPosition,
      setClickedPointPosition,
      draggingCol,
      setDraggingCol,
      starredPoints,
      setStarredPoints,
      starredPlans,
      setStarredPlans,
      starredGeometries,
      setStarredGeometries,
    },
    refs: {
      popupRef: useRef<HTMLDivElement | null>(null),
      headerRef: useRef<HTMLDivElement | null>(null),
      tableScrollRef: useRef<HTMLDivElement | null>(null),
      topScrollRef: useRef<HTMLDivElement | null>(null),
      syncingRef: useRef(false),
      originalGraphicsMap: useRef<Map<number, Graphic>>(new Map()),
    },
  };
}
