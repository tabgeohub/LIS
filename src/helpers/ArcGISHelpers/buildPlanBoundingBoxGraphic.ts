import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { createPlanBoundingBoxPolygon } from "./planBoundingBoxGeometry";
import {
  DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS,
  type CreatePlanBoundingBoxGraphicOptions,
  type PlanBoundingBoxPoint,
} from "./planBoundingBoxTypes";

/** Graphic outline around all points in a flight plan. */
export function buildPlanBoundingBoxGraphic(
  points: PlanBoundingBoxPoint[] | null | undefined,
  options: CreatePlanBoundingBoxGraphicOptions = {}
): Graphic | null {
  const polygon = createPlanBoundingBoxPolygon(points);
  if (!polygon) return null;

  const { symbolOptions = {}, attributes = {} } = options;

  const fillSymbol = new SimpleFillSymbol({
    color: symbolOptions.fillColor ?? DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS.fillColor,
    outline: {
      color:
        symbolOptions.outlineColor ??
        DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS.outlineColor,
      width:
        symbolOptions.outlineWidth ??
        DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS.outlineWidth,
    },
  });

  return new Graphic({
    geometry: polygon,
    symbol: fillSymbol,
    attributes,
  });
}
