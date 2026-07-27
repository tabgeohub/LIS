import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { createPlanBoundingBoxPolygon } from "./planBoundingBoxGeometry";
import {
  DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS,
  type CreatePlanBoundingBoxGraphicOptions,
  type PlanBoundingBoxPoint,
} from "./planBoundingBoxTypes";

function coalesceSymbolOption<T>(value: T | undefined, fallback: T): T {
  return value ?? fallback;
}

function buildBoundingBoxFillSymbol(
  symbolOptions: NonNullable<CreatePlanBoundingBoxGraphicOptions["symbolOptions"]>
) {
  return new SimpleFillSymbol({
    color: coalesceSymbolOption(
      symbolOptions.fillColor,
      DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS.fillColor
    ),
    outline: {
      color: coalesceSymbolOption(
        symbolOptions.outlineColor,
        DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS.outlineColor
      ),
      width: coalesceSymbolOption(
        symbolOptions.outlineWidth,
        DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS.outlineWidth
      ),
    },
  });
}

/** Graphic outline around all points in a flight plan. */
export function buildPlanBoundingBoxGraphic(options: {
  points: PlanBoundingBoxPoint[] | null | undefined;
  symbolOptions?: CreatePlanBoundingBoxGraphicOptions["symbolOptions"];
  attributes?: CreatePlanBoundingBoxGraphicOptions["attributes"];
}): Graphic | null {
  const polygon = createPlanBoundingBoxPolygon({ points: options.points });
  if (!polygon) return null;

  const symbolOptions = options.symbolOptions ?? {};
  const attributes = options.attributes ?? {};

  return new Graphic({
    geometry: polygon,
    symbol: buildBoundingBoxFillSymbol(symbolOptions),
    attributes,
  });
}
