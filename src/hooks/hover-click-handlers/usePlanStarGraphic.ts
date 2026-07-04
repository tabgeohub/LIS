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

export function addPlanStarGraphic(input: {
  plan: FlightPlanType;
  layer: __esri.GraphicsLayer;
  variant?: PlanStarGraphicVariant;
}) {
  const variant = input.variant ?? "search";
  const graphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(input.plan), {
    symbolOptions: getStarSymbolOptions(variant),
    attributes: { id: input.plan.id },
  });

  if (graphic) {
    input.layer.graphics.add(graphic);
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

export function addPlanStarGraphics(input: {
  plans: FlightPlanType[];
  layer: __esri.GraphicsLayer;
  variant?: PlanStarGraphicVariant;
}) {
  input.plans.forEach((plan) =>
    addPlanStarGraphic({ plan, layer: input.layer, variant: input.variant })
  );
}

export function usePlanStarGraphic() {
  return {
    addPlanStarGraphic,
    removePlanStarGraphics,
    addPlanStarGraphics,
  };
}
