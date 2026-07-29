export interface PlanBoundingBoxPoint {
  latitude: number;
  longitude: number;
}

export interface PlanBoundingBoxExtents {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface PlanBoundingBoxSymbolOptions {
  fillColor?: [number, number, number, number];
  outlineColor?: [number, number, number, number];
  outlineWidth?: number;
}

export interface CreatePlanBoundingBoxGraphicOptions {
  symbolOptions?: PlanBoundingBoxSymbolOptions;
  attributes?: Record<string, unknown>;
}

export {
  PLAN_BOUNDING_BOX_SYMBOLS,
  DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS,
} from "./planBoundingBoxSymbols";
