import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  type PlanBoundingBoxSymbolOptions,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "./createPlanBoundingBoxGraphic";
import type { FlightPlanType } from "Types";

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
  const graphic = createPlanBoundingBoxGraphic({
    points: getFlightPlanPoints(input.plan),
    symbolOptions: getStarSymbolOptions(input.variant ?? "search"),
    attributes: { id: input.plan.id },
  });
  if (graphic) input.layer.graphics.add(graphic);
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
    addPlanStarGraphic({
      plan,
      layer: input.layer,
      variant: input.variant,
    })
  );
}
