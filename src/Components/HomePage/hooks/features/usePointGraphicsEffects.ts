import { useEffect } from "react";
import { EnrichedPointType } from "Types";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import { buildPointMapGraphics } from "./pointMapGraphics";

function clearLayer(layer: __esri.GraphicsLayer | null | undefined): void {
  layer?.removeAll();
}

function renderTimesliderPointGraphics(input: {
  layer: __esri.GraphicsLayer;
  points: EnrichedPointType[];
  timesliderPlans: FinishedFlightPlanType[];
}): void {
  if (input.timesliderPlans.length === 0) {
    clearLayer(input.layer);
    return;
  }
  const { pointIds } = getPointAndGeometryIdsFromPlans(input.timesliderPlans);
  replaceGraphics(
    input.layer,
    buildPointMapGraphics(input.points.filter((point) => pointIds.has(point.id)))
  );
}

function renderPointGraphicsForContext(input: {
  layer: __esri.GraphicsLayer;
  points: EnrichedPointType[];
  selectedTab: string;
  selectedPage: string;
  timesliderPlans: FinishedFlightPlanType[];
}): void {
  if (input.selectedTab === "editGeometry") {
    clearLayer(input.layer);
    return;
  }
  if (input.selectedPage === "timeslider") {
    renderTimesliderPointGraphics(input);
    return;
  }
  replaceGraphics(input.layer, buildPointMapGraphics(input.points));
}

export function usePointGraphicsRendering(input: {
  map: __esri.Map | null;
  layer: __esri.GraphicsLayer | null;
  points: EnrichedPointType[];
  userId?: number;
  selectedTab: string;
  selectedPage: string;
  timesliderPlans: FinishedFlightPlanType[];
}) {
  useEffect(() => {
    if (!validateMapView(input.map, input.layer) || !input.userId || !input.layer) {
      return;
    }
    renderPointGraphicsForContext({
      layer: input.layer,
      points: input.points,
      selectedTab: input.selectedTab,
      selectedPage: input.selectedPage,
      timesliderPlans: input.timesliderPlans,
    });
  }, [
    input.map,
    input.layer,
    input.points,
    input.userId,
    input.selectedTab,
    input.selectedPage,
    input.timesliderPlans,
  ]);
}

function findLayerGraphicHit(
  response: __esri.HitTestResult,
  layer: __esri.GraphicsLayer
): __esri.GraphicHit | undefined {
  return response.results.find(
    (result) => (result as __esri.GraphicHit).graphic?.layer === layer
  ) as __esri.GraphicHit | undefined;
}

function notifyPointGraphicClick(
  hit: __esri.GraphicHit | undefined,
  onPoint: (attributes: EnrichedPointType) => void
): void {
  if (!hit?.graphic?.attributes?.id) return;
  onPoint(hit.graphic.attributes);
}

async function runPointGraphicClick(options: {
  mapView: __esri.MapView;
  layer: __esri.GraphicsLayer;
  onPoint: (attributes: EnrichedPointType) => void;
  event: __esri.ViewClickEvent;
  clickGuard: ReturnType<typeof createDebouncedClickGuard>;
}): Promise<void> {
  if (options.clickGuard.shouldSkip()) return;
  try {
    const response = await options.mapView.hitTest(options.event, {
      include: [options.layer],
    });
    notifyPointGraphicClick(
      findLayerGraphicHit(response, options.layer),
      options.onPoint
    );
  } catch (error) {
    console.error("Error in point click handler:", error);
  } finally {
    options.clickGuard.finish();
  }
}

export function usePointGraphicsClick(input: {
  mapView: __esri.MapView | null;
  layer: __esri.GraphicsLayer | null;
  onPoint: (attributes: EnrichedPointType) => void;
}) {
  useEffect(() => {
    if (!input.mapView || !input.layer) return;
    const clickGuard = createDebouncedClickGuard();
    const mapView = input.mapView;
    const layer = input.layer;
    const handle = mapView.on("click", (event) =>
      runPointGraphicClick({
        mapView,
        layer,
        onPoint: input.onPoint,
        event,
        clickGuard,
      })
    );
    return () => handle.remove();
  }, [input.mapView, input.layer, input.onPoint]);
}
