import { useState, useRef, useCallback } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import Graphic from "@arcgis/core/Graphic";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  handleDragStart,
  handleDragOver,
  handleDrop,
} from "./common/functions/columnDragHandlers";
import { syncScrollPositions } from "./common/functions/syncScrollPositions";
import { useClickOutside } from "./common/hooks/useClickOutside";
import { useScrollOrResize } from "./common/hooks/useScrollOrResize";
import { useHeaderHeight } from "./common/hooks/useHeaderHeight";
import { useTableScrollWidth } from "./common/hooks/useTableScrollWidth";
import { useTableLayout } from "./common/hooks/useTableLayout";
import { useMapGraphics } from "./common/hooks/useMapGraphics";

export function usePointsViewController(containerHeight: number) {
  const [clickedPoint, setClickedPoint] = useState<EnrichedPointType>();
  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
  const [starredPlans, setStarredPlans] = useState<FlightPlanType[]>([]);
  const [starredGeometries, setStarredGeometries] = useState<any[]>([]);
  const [tab, setTab] = useState<string>("points");

  const { pointsTable, flightPlans, geometriesTable } = useOpenTable();
  const { graphicsLayerHover, graphicsLayer, mapView, yellowGraphicsLayer } =
    useMapViewState();

  const popupRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const syncingRef = useRef(false);
  const originalGraphicsMap = useRef<Map<number, Graphic>>(new Map());

  useClickOutside({
    popupRef,
    setClickedPoint,
    setClickedPointPosition,
  });
  useScrollOrResize(setClickedPointPosition);
  const headerHeight = useHeaderHeight(headerRef);
  const { tableScrollWidth, scrollContainerWidth } = useTableScrollWidth({
    tableScrollRef,
    tab,
    pointsTableLength: pointsTable.length,
    flightPlansLength: flightPlans.length,
    geometriesTableLength: geometriesTable.length,
    starredPointsLength: starredPoints.length,
    starredPlansLength: starredPlans.length,
    starredGeometriesLength: starredGeometries.length,
  });
  const { availableHeight, needsHorizontalScroll, scrollAreaHeight } =
    useTableLayout({
      containerHeight,
      headerHeight,
      tableScrollWidth,
      containerWidth: scrollContainerWidth,
    });

  useMapGraphics({
    tab,
    pointsTable,
    geometriesTable,
    flightPlans,
    starredPoints,
    starredGeometries,
    starredPlans,
    graphicsLayer,
    graphicsLayerHover,
    yellowGraphicsLayer,
    mapView,
    originalGraphicsMap,
  });

  const handleDragStartWrapper = useCallback(
    (col: string) => handleDragStart(col, setDraggingCol),
    [setDraggingCol]
  );

  const handleDropWrapper = useCallback(
    (
      targetCol: string,
      columns: string[],
      setFunction: (value: string[] | ((prev: string[]) => string[])) => void
    ) =>
      handleDrop({
        targetCol,
        draggingCol,
        columns,
        setFunction,
        setDraggingCol,
      }),
    [draggingCol, setDraggingCol]
  );

  const handleScrollSync = useCallback(
    (source: "top" | "table") =>
      syncScrollPositions({
        source,
        topScrollRef,
        tableScrollRef,
        syncingRef,
      }),
    [topScrollRef, tableScrollRef, syncingRef]
  );

  return {
    tab,
    setTab,
    clickedPoint,
    clickedPointPosition,
    setClickedPoint,
    setClickedPointPosition,
    starredPoints,
    setStarredPoints,
    starredPlans,
    setStarredPlans,
    starredGeometries,
    setStarredGeometries,
    pointsTable,
    flightPlans,
    geometriesTable,
    popupRef,
    headerRef,
    tableScrollRef,
    topScrollRef,
    syncingRef,
    originalGraphicsMap,
    availableHeight,
    needsHorizontalScroll,
    scrollAreaHeight,
    tableScrollWidth,
    handleDragStartWrapper,
    handleDragOver,
    handleDropWrapper,
    handleScrollSync,
  };
}
