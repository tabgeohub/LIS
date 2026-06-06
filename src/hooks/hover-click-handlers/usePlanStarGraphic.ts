import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PlanBoundingBoxSymbolOptions,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import { FlightPlanType } from "Types";

export type PlanStarGraphicVariant = "search" | "table";

function getStarSymbolOptions(
  variant: PlanStarGraphicVariant
): PlanBoundingBoxSymbolOptions {
  return variant === "search"
    ? PLAN_BOUNDING_BOX_SYMBOLS.starSearch
    : PLAN_BOUNDING_BOX_SYMBOLS.starTable;
}

export function addPlanStarGraphic(
  plan: FlightPlanType,
  layer: __esri.GraphicsLayer,
  variant: PlanStarGraphicVariant = "search"
) {
  const graphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
    symbolOptions: getStarSymbolOptions(variant),
    attributes: { id: plan.id },
  });

  if (graphic) {
    layer.graphics.add(graphic);
  }
}

export function removePlanStarGraphics(
  planId: number | string,
  layer: __esri.GraphicsLayer
) {
  layer.graphics.removeMany(
    layer.graphics.filter((graphic) => graphic.attributes?.id === planId)
  );
}

export function addPlanStarGraphics(
  plans: FlightPlanType[],
  layer: __esri.GraphicsLayer,
  variant: PlanStarGraphicVariant = "search"
) {
  plans.forEach((plan) => addPlanStarGraphic(plan, layer, variant));
}

export function usePlanStarGraphic() {
  return {
    addPlanStarGraphic,
    removePlanStarGraphics,
    addPlanStarGraphics,
  };
}
