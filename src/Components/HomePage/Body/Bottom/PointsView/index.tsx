import { useState, useRef, useCallback } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import Graphic from "@arcgis/core/Graphic";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import PointsTable from "./PointsTable";
import FlightPlansTable from "./FlightPlansTable";
import GeometriesTable from "./GeometriesTable";
import TabButtons from "./common/components/TabButtons";
import HorizontalScrollControls from "./common/components/HorizontalScrollControls";
import ClickedPointPopup from "./common/components/ClickedPointPopup";
import { removeColumn } from "./common/functions/removeColumn";
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

interface PointsViewProps {
  containerHeight: number;
  containerWidth: number;
}

export default function PointsView({
  containerHeight,
  containerWidth,
}: PointsViewProps) {
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

  // Custom hooks
  useClickOutside(
    popupRef,
    setClickedPoint,
    setClickedPointPosition
  );
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
    useTableLayout(
      containerHeight,
      headerHeight,
      tableScrollWidth,
      scrollContainerWidth
    );

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

  // Column drag handlers - memoized to prevent unnecessary re-renders
  const handleDragStartWrapper = useCallback(
    (col: string) => handleDragStart(col, setDraggingCol),
    [setDraggingCol]
  );

  const handleDropWrapper = useCallback(
    (
      targetCol: string,
      columns: string[],
      setFunction: (value: string[] | ((prev: string[]) => string[])) => void
    ) => handleDrop(targetCol, draggingCol, columns, setFunction, setDraggingCol),
    [draggingCol, setDraggingCol]
  );

  // Scroll sync handler - memoized to prevent unnecessary re-renders
  const handleScrollSync = useCallback(
    (source: "top" | "table") =>
      syncScrollPositions(source, topScrollRef, tableScrollRef, syncingRef),
    [topScrollRef, tableScrollRef, syncingRef]
  );

  return (
    <div className="h-full w-full flex flex-col min-w-0 min-h-0">
      <div ref={headerRef} className="shrink-0 min-w-0 max-w-full overflow-hidden">
        <TabButtons
          tab={tab}
          setTab={setTab}
          pointsTableLength={pointsTable.length}
          geometriesTableLength={geometriesTable.length}
          flightPlansLength={flightPlans.length}
        />
      </div>

      <div
        className="flex-1 min-h-0 min-w-0 max-w-full overflow-hidden flex flex-col"
        style={{
          maxHeight:
            typeof availableHeight === "number"
              ? `${availableHeight}px`
              : undefined,
        }}
      >
        <HorizontalScrollControls
          needsHorizontalScroll={needsHorizontalScroll}
          tableScrollWidth={tableScrollWidth}
          topScrollRef={topScrollRef}
          tableScrollRef={tableScrollRef}
          syncingRef={syncingRef}
        />
        <div
          className="flex-1 min-h-0 min-w-0 max-w-full w-full overflow-x-auto overflow-y-auto overscroll-contain thin-scrollbar"
          ref={tableScrollRef}
          onScroll={() => handleScrollSync("table")}
          style={{
            maxHeight:
              typeof scrollAreaHeight === "number"
                ? `${scrollAreaHeight}px`
                : undefined,
          }}
        >
          {tab === "points" ? (
            <PointsTable
              containerHeight={availableHeight}
              containerWidth={containerWidth}
              starredPoints={starredPoints}
              setStarredPoints={setStarredPoints}
              handleDragStart={handleDragStartWrapper}
              handleDragOver={handleDragOver}
              handleDrop={handleDropWrapper}
              removeColumn={removeColumn}
              setClickedPoint={setClickedPoint}
              setClickedPointPosition={setClickedPointPosition}
            />
          ) : tab === "geometries" ? (
            <GeometriesTable
              containerHeight={availableHeight}
              containerWidth={containerWidth}
              starredGeometries={starredGeometries}
              setStarredGeometries={setStarredGeometries}
              handleDragStart={handleDragStartWrapper}
              handleDragOver={handleDragOver}
              handleDrop={handleDropWrapper}
              removeColumn={removeColumn}
            />
          ) : (
            <FlightPlansTable
              containerHeight={availableHeight}
              containerWidth={containerWidth}
              starredPlans={starredPlans}
              setStarredPlans={setStarredPlans}
              handleDragStart={handleDragStartWrapper}
              handleDragOver={handleDragOver}
              handleDrop={handleDropWrapper}
              removeColumn={removeColumn}
              setClickedPointPosition={setClickedPointPosition}
              originalGraphicsMap={originalGraphicsMap}
            />
          )}
        </div>
      </div>

      <ClickedPointPopup
        clickedPoint={clickedPoint}
        clickedPointPosition={clickedPointPosition}
        popupRef={popupRef}
      />
    </div>
  );
}
