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

function renderTimesliderGeometries(input: {
  layer: __esri.GraphicsLayer;
  geometries: Geometry[];
  timesliderPlans: FinishedFlightPlanType[];
}) {
  if (input.timesliderPlans.length === 0) {
    input.layer.removeAll();
    return;
  }
  const { geometryIds } = getPointAndGeometryIdsFromPlans(input.timesliderPlans);
  replaceGraphics(
    input.layer,
    buildGeometryMapGraphics(
      input.geometries.filter((item) => geometryIds.has(item.id))
    )
  );
}

function renderDefaultGeometries(input: {
  layer: __esri.GraphicsLayer;
  geometries: Geometry[];
  step: number;
  flightPlanStep: number;
}): (() => void) | undefined {
  if (
    shouldSkipDefaultGeometryRender({
      step: input.step,
      flightPlanStep: input.flightPlanStep,
      geometriesCount: input.geometries.length,
    })
  ) {
    return;
  }

  replaceGraphics(input.layer, buildGeometryMapGraphics(input.geometries));
  return () => input.layer.removeAll();
}

function canRenderGeometryGraphics(input: {
  layer: __esri.GraphicsLayer | null;
  userId?: number;
}): input is { layer: __esri.GraphicsLayer; userId: number } {
  return Boolean(input.layer && input.userId);
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
    if (!canRenderGeometryGraphics(input)) return;

    if (input.selectedPage === "timeslider") {
      renderTimesliderGeometries({
        layer: input.layer,
        geometries: input.geometries,
        timesliderPlans: input.timesliderPlans,
      });
      return () => input.layer?.removeAll();
    }

    return renderDefaultGeometries({
      layer: input.layer,
      geometries: input.geometries,
      step: input.step,
      flightPlanStep: input.flightPlanStep,
    });
  }, [
    input.layer,
    input.geometries,
    input.userId,
    input.selectedPage,
    input.timesliderPlans,
    input.step,
    input.flightPlanStep,
  ]);
}
