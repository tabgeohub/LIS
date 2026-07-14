import { useEffect } from "react";
import { FinishedFlightPlanType } from "Types/finished_plans";
import type { Geometry } from "Types/geometry";
import { getPointAndGeometryIdsFromPlans } from "@helpers/timeslider";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";
import { buildGeometryMapGraphics } from "./geometryMapGraphics";

export function shouldSkipDefaultGeometryRender(input: {
  step: number;
  flightPlanStep: number;
  geometriesCount: number;
}) {
  return input.geometriesCount === 0 || input.step === 2 ||
    input.flightPlanStep === 3 || input.flightPlanStep === 4;
}

export function useGeometryGraphicsRendering(input: {
  layer: __esri.GraphicsLayer | null;
  geometries: Geometry[];
  userId?: number;
  selectedPage: string;
  timesliderPlans: FinishedFlightPlanType[];
  step: number;
  flightPlanStep: number;
}) {
  useEffect(() => {
    if (!input.layer || !input.userId) return;
    if (input.selectedPage === "timeslider") {
      if (input.timesliderPlans.length === 0) {
        input.layer.removeAll();
        return;
      }
      const { geometryIds } = getPointAndGeometryIdsFromPlans(input.timesliderPlans);
      replaceGraphics(input.layer, buildGeometryMapGraphics(input.geometries.filter((item) => geometryIds.has(item.id))));
      return () => input.layer?.removeAll();
    }
    if (shouldSkipDefaultGeometryRender({ ...input, geometriesCount: input.geometries.length })) return;
    replaceGraphics(input.layer, buildGeometryMapGraphics(input.geometries));
    return () => input.layer?.removeAll();
  }, [input.layer, input.geometries, input.userId, input.selectedPage, input.timesliderPlans, input.step, input.flightPlanStep]);
}
