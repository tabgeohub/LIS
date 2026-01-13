/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { createQuadrantGraphic } from "../../Left/Voorbereiding/ViewPlan/helpers/createQuadrantGraphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import PointsTable from "./PointsTable";
import FlightPlansTable from "./FlightPlansTable";
import ClickedPointFunctions from "../ClickedPointFunctions";

interface PointsViewProps {
  containerHeight: number;
  containerWidth: number;
}

export default function PointsView({
  containerHeight,
  containerWidth,
}: PointsViewProps) {
  const [clickedPoint, setClickedPoint] = useState<EnrichedPointType>();
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
  const [starredPlans, setStarredPlans] = useState<FlightPlanType[]>([]);
  const [tab, setTab] = useState<string>("points");

  const { pointsTable, flightPlans } = useOpenTable();
  const { graphicsLayerHover, graphicsLayer, mapView, yellowGraphicsLayer } =
    useMapViewState();

  const popupRef = useRef<HTMLDivElement | null>(null);
  const originalGraphicsMap = useRef<Map<number, Graphic>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setClickedPoint(undefined);
        setClickedPointPosition(null);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const removeColumn = (
    colName: string,
    setFunction: (value: string[] | ((prev: string[]) => string[])) => void
  ) => {
    setFunction((prev: string[]) => prev.filter((col) => col !== colName));
  };

  const handleDragStart = (col: string) => setDraggingCol(col);
  const handleDragOver = (e: React.DragEvent<HTMLTableHeaderCellElement>) =>
    e.preventDefault();

  const handleDrop = (
    targetCol: string,
    columns: string[],
    setFunction: (value: string[] | ((prev: string[]) => string[])) => void
  ) => {
    if (!draggingCol || draggingCol === targetCol) return;
    const updated = [...columns];
    const fromIndex = updated.indexOf(draggingCol);
    const toIndex = updated.indexOf(targetCol);
    updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, draggingCol);
    setFunction(updated);
    setDraggingCol(null);
  };

  useEffect(() => {
    const handleScrollOrResize = () => setClickedPointPosition(null);
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  useEffect(() => {
    graphicsLayer?.removeAll();
    yellowGraphicsLayer?.graphics.removeAll();
    if (tab === "points") {
      if (!mapView || !yellowGraphicsLayer) return;

      pointsTable.forEach((point) => {
        if (!point) return;

        const yellow = new SimpleMarkerSymbol({
          color: "yellow",
          size: 12,
          style: "circle",
          outline: { color: "white", width: 1 },
        });

        const geometry = new Point({
          longitude: point.longitude,
          latitude: point.latitude,
          spatialReference: { wkid: 4326 },
        });

        const graphic = new Graphic({
          geometry,
          symbol: yellow,
          attributes: point,
        });
        yellowGraphicsLayer.add(graphic);

        const alreadyStarred = starredPoints.find((p) => p.id === point.id);
        if (alreadyStarred) {
          const g = new Graphic({
            geometry: new Point({
              longitude: point.longitude,
              latitude: point.latitude,
            }),
            symbol: new SimpleMarkerSymbol({
              style: "circle",
              size: 14,
              color: [255, 255, 255, 0],
              outline: { color: [0, 0, 255, 1], width: 2 },
            }),
            attributes: { id: point.id },
          });
          graphicsLayer?.graphics.add(g);
        }
      });
    }

    if (tab === "flightPlans") {
      if (mapView && graphicsLayer) {
        graphicsLayer.removeAll();
        flightPlans?.forEach((plan) => {
          plan?.points.forEach(() => {
            const quadrantGraphic = createQuadrantGraphic(plan.points);
            quadrantGraphic.attributes = { id: plan.id };
            graphicsLayer.add(quadrantGraphic);
            originalGraphicsMap.current.set(plan.id, quadrantGraphic);
          });

          const alreadyStarred = starredPlans.find((p) => p.id === plan.id);
          if (alreadyStarred) {
            const oldGraphic = originalGraphicsMap.current.get(plan.id);
            if (oldGraphic) graphicsLayer?.remove(oldGraphic);
            graphicsLayerHover?.removeAll();

            const minLat = Math.min(...plan.points.map((p) => p.latitude));
            const maxLat = Math.max(...plan.points.map((p) => p.latitude));
            const minLon = Math.min(...plan.points.map((p) => p.longitude));
            const maxLon = Math.max(...plan.points.map((p) => p.longitude));

            const polygon = new Polygon({
              rings: [
                [
                  [minLon, maxLat],
                  [maxLon, maxLat],
                  [maxLon, minLat],
                  [minLon, minLat],
                  [minLon, maxLat],
                ],
              ],
              spatialReference: { wkid: 4326 },
            });

            const fillSymbol = new SimpleFillSymbol({
              color: [0, 255, 0, 0],
              outline: { color: [0, 0, 255, 1], width: 2 },
            });

            const graphic = new Graphic({
              geometry: polygon,
              symbol: fillSymbol,
            });
            graphicsLayer?.graphics.add(graphic);
          }
        });
      }
    }
  }, [tab]);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState(0);
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setHeaderHeight(entry.contentRect.height);
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const availableHeight =
    containerHeight > 0
      ? Math.max(containerHeight - headerHeight, 0)
      : undefined;
  const needsHorizontalScroll =
    tableScrollWidth > 0 &&
    containerWidth > 0 &&
    tableScrollWidth > containerWidth;
  const horizontalScrollbarHeight = needsHorizontalScroll ? 18 : 0;
  const scrollAreaHeight =
    typeof availableHeight === "number"
      ? Math.max(availableHeight - horizontalScrollbarHeight, 0)
      : undefined;

  const syncScrollPositions = (source: "top" | "table") => {
    if (!topScrollRef.current || !tableScrollRef.current) return;
    if (syncingRef.current) return;
    syncingRef.current = true;

    if (source === "top") {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    } else {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }

    window.requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  };

  const scrollHorizontally = (direction: "left" | "right") => {
    if (!tableScrollRef.current || !topScrollRef.current) return;
    const delta = direction === "left" ? -250 : 250;
    tableScrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
    topScrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    const wrapper = tableScrollRef.current;
    if (!wrapper) {
      setTableScrollWidth(0);
      return;
    }

    const tableEl = wrapper.querySelector("table");
    if (!tableEl) {
      setTableScrollWidth(0);
      return;
    }

    const updateWidth = () => {
      setTableScrollWidth(tableEl.scrollWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(tableEl);

    return () => observer.disconnect();
  }, [
    tab,
    pointsTable.length,
    flightPlans.length,
    containerWidth,
    starredPoints.length,
    starredPlans.length,
  ]);

  return (
    <div className="h-full w-full flex flex-col min-w-0 min-h-0">
      <div ref={headerRef} className="flex gap-2 px-2 pt-2 shrink-0">
        {pointsTable.length > 0 && (
          <button
            className={`px-2 py-1 text-sm border rounded-t-lg ${
              tab === "points"
                ? "bg-white"
                : "bg-gray-200 shadow-[rgba(0,_0,_0,_0.24)_0px_1px_8px]"
            }`}
            onClick={() => setTab("points")}
          >
            Aandachtspunten
          </button>
        )}

        {flightPlans.length > 0 && (
          <button
            className={`px-2 py-1 text-sm border rounded-t-lg ${
              tab === "flightPlans"
                ? "bg-white"
                : "bg-gray-200 shadow-[rgba(0,_0,_0,_0.24)_0px_1px_8px]"
            }`}
            onClick={() => setTab("flightPlans")}
          >
            Vluchtplan
          </button>
        )}
      </div>

      <div
        className="flex-1 min-h-0 min-w-0"
        style={{
          maxHeight:
            typeof availableHeight === "number"
              ? `${availableHeight}px`
              : undefined,
        }}
      >
        {needsHorizontalScroll && (
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={() => scrollHorizontally("left")}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
            >
              ←
            </button>
            <div
              ref={topScrollRef}
              onScroll={() => syncScrollPositions("top")}
              className="h-4 flex-1 overflow-x-auto thin-scrollbar"
            >
              <div
                style={{
                  width: `${tableScrollWidth}px`,
                  height: "4px",
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => scrollHorizontally("right")}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
            >
              →
            </button>
          </div>
        )}
        <div
          className="h-full w-full overflow-auto overscroll-contain thin-scrollbar"
          ref={tableScrollRef}
          onScroll={() => syncScrollPositions("table")}
          style={{
            maxHeight:
              typeof scrollAreaHeight === "number"
                ? `${scrollAreaHeight}px`
                : undefined,
            maxWidth: containerWidth ? `${containerWidth}px` : undefined,
          }}
        >
          {tab === "points" ? (
            <PointsTable
              containerHeight={availableHeight}
              containerWidth={containerWidth}
              starredPoints={starredPoints}
              setStarredPoints={setStarredPoints}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              removeColumn={removeColumn}
              setClickedPoint={setClickedPoint}
              setClickedPointPosition={setClickedPointPosition}
            />
          ) : (
            <FlightPlansTable
              containerHeight={availableHeight}
              containerWidth={containerWidth}
              starredPlans={starredPlans}
              setStarredPlans={setStarredPlans}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              removeColumn={removeColumn}
              setClickedPointPosition={setClickedPointPosition}
              originalGraphicsMap={originalGraphicsMap}
            />
          )}
        </div>
      </div>

      {clickedPoint && clickedPointPosition && (
        <div
          ref={popupRef}
          className="fixed bg-white w-64 max-w-64 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50"
          style={{
            bottom: window.innerHeight - clickedPointPosition.top + 30,
            left: clickedPointPosition.left + 30,
          }}
        >
          <ClickedPointFunctions clickedPoint={clickedPoint} />
        </div>
      )}
    </div>
  );
}
