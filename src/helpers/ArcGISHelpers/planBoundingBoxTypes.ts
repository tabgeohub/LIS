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

export const DEFAULT_PLAN_BBOX_SYMBOL_OPTIONS: Required<PlanBoundingBoxSymbolOptions> =
  PLAN_BOUNDING_BOX_SYMBOLS.click;
