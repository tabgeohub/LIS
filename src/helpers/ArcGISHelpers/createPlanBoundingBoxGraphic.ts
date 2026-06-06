import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

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

export const PLAN_BOUNDING_BOX_SYMBOLS = {
  click: {
    fillColor: [227, 139, 79, 0] as [number, number, number, number],
    outlineColor: [0, 255, 0, 1] as [number, number, number, number],
    outlineWidth: 2,
  },
  hover: {
    fillColor: [227, 139, 79, 0] as [number, number, number, number],
    outlineColor: [227, 139, 79, 1] as [number, number, number, number],
    outlineWidth: 2,
  },
  hoverSearchList: {
    fillColor: [0, 255, 0, 0.1] as [number, number, number, number],
    outlineColor: [0, 255, 0, 1] as [number, number, number, number],
    outlineWidth: 2,
  },
  starSearch: {
    fillColor: [0, 255, 0, 0] as [number, number, number, number],
    outlineColor: [0, 0, 255, 1] as [number, number, number, number],
    outlineWidth: 5,
  },
  starTable: {
    fillColor: [0, 255, 0, 0] as [number, number, number, number],
    outlineColor: [0, 0, 255, 1] as [number, number, number, number],
    outlineWidth: 2,
  },
  finishedPlanClick: {
    fillColor: [227, 139, 79, 0] as [number, number, number, number],
    outlineColor: [0, 255, 0, 0.7] as [number, number, number, number],
    outlineWidth: 5,
  },
  finishedPlanHover: {
    fillColor: [227, 139, 79, 0] as [number, number, number, number],
    outlineColor: [0, 255, 0, 0.1] as [number, number, number, number],
    outlineWidth: 5,
  },
} as const;

const DEFAULT_SYMBOL_OPTIONS: Required<PlanBoundingBoxSymbolOptions> =
  PLAN_BOUNDING_BOX_SYMBOLS.click;

export function getFlightPlanPoints(plan: {
  points?: PlanBoundingBoxPoint[] | null;
  pointsObjects?: PlanBoundingBoxPoint[] | null;
}): PlanBoundingBoxPoint[] {
  return plan.pointsObjects || plan.points || [];
}

function getValidPlanPoints(
  points: PlanBoundingBoxPoint[] | null | undefined
): PlanBoundingBoxPoint[] {
  if (!points?.length) return [];

  return points.filter(
    (point) =>
      typeof point.latitude === "number" &&
      typeof point.longitude === "number" &&
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude)
  );
}

/**
 * Min/max lat/lon envelope for a set of plan points.
 */
export function getPlanBoundingBoxExtents(
  points: PlanBoundingBoxPoint[] | null | undefined
): PlanBoundingBoxExtents | null {
  const valid = getValidPlanPoints(points);
  if (valid.length === 0) return null;

  return {
    minLat: Math.min(...valid.map((p) => p.latitude)),
    maxLat: Math.max(...valid.map((p) => p.latitude)),
    minLon: Math.min(...valid.map((p) => p.longitude)),
    maxLon: Math.max(...valid.map((p) => p.longitude)),
  };
}

/**
 * Bounding-box polygon used across flight plan map highlights.
 * Ring order matches existing plan click/hover/star graphics.
 */
export function createPlanBoundingBoxPolygon(
  points: PlanBoundingBoxPoint[] | null | undefined
): Polygon | null {
  const extents = getPlanBoundingBoxExtents(points);
  if (!extents) return null;

  const { minLat, maxLat, minLon, maxLon } = extents;

  return new Polygon({
    rings: [
      [
        [minLon, maxLat],
        [maxLon, maxLat],
        [maxLon, minLat],
        [minLon, minLat],
        [minLon, maxLat],
      ],
    ],
    spatialReference: { wkid: 4326 },
  });
}

/**
 * Graphic outline around all points in a flight plan.
 */
export function createPlanBoundingBoxGraphic(
  points: PlanBoundingBoxPoint[] | null | undefined,
  options: CreatePlanBoundingBoxGraphicOptions = {}
): Graphic | null {
  const polygon = createPlanBoundingBoxPolygon(points);
  if (!polygon) return null;

  const { symbolOptions = {}, attributes = {} } = options;

  const fillSymbol = new SimpleFillSymbol({
    color: symbolOptions.fillColor ?? DEFAULT_SYMBOL_OPTIONS.fillColor,
    outline: {
      color: symbolOptions.outlineColor ?? DEFAULT_SYMBOL_OPTIONS.outlineColor,
      width: symbolOptions.outlineWidth ?? DEFAULT_SYMBOL_OPTIONS.outlineWidth,
    },
  });

  return new Graphic({
    geometry: polygon,
    symbol: fillSymbol,
    attributes,
  });
}
