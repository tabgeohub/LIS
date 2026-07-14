import { useEffect } from "react";
import { EnrichedPointType } from "Types";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import { buildPointMapGraphics } from "./pointMapGraphics";

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
    if (!validateMapView(input.map, input.layer) || !input.userId) return;
    if (input.selectedTab === "editGeometry") {
      input.layer?.removeAll();
      return;
    }
    if (input.selectedPage === "timeslider") {
      if (input.timesliderPlans.length === 0) {
        input.layer?.removeAll();
        return;
      }
      const { pointIds } = getPointAndGeometryIdsFromPlans(input.timesliderPlans);
      replaceGraphics(input.layer!, buildPointMapGraphics(input.points.filter((point) => pointIds.has(point.id))));
      return;
    }
    replaceGraphics(input.layer!, buildPointMapGraphics(input.points));
  }, [input.map, input.layer, input.points, input.userId, input.selectedTab, input.selectedPage, input.timesliderPlans]);
}

export function usePointGraphicsClick(input: {
  mapView: __esri.MapView | null;
  layer: __esri.GraphicsLayer | null;
  onPoint: (attributes: EnrichedPointType) => void;
}) {
  useEffect(() => {
    if (!input.mapView || !input.layer) return;
    const clickGuard = createDebouncedClickGuard();
    const handle = input.mapView.on("click", async (event) => {
      if (clickGuard.shouldSkip()) return;
      try {
        const response = await input.mapView!.hitTest(event, { include: [input.layer!] });
        const hit = response.results.find((result) =>
          (result as __esri.GraphicHit).graphic?.layer === input.layer
        ) as __esri.GraphicHit | undefined;
        if (hit?.graphic?.attributes?.id) input.onPoint(hit.graphic.attributes);
      } catch (error) {
        console.error("Error in point click handler:", error);
      } finally {
        clickGuard.finish();
      }
    });
    return () => handle.remove();
  }, [input.mapView, input.layer, input.onPoint]);
}
