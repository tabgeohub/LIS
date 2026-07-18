import {
  geometryPathFromPoints,
  isPolygonGeometryType,
} from "@helpers/ArcGISHelpers/geometryPathFromPoints";
import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";
import { drawGeometryHoverSkyBlue as drawHover } from "./drawGeometryHoverSkyBlue";

export { TIMESLIDER_RIGHT_HOVER_LABEL } from "./timesliderRightHoverLabel";
import { TIMESLIDER_RIGHT_HOVER_LABEL } from "./timesliderRightHoverLabel";
export { drawHoverPin } from "./drawHoverPin";

/** One row per point per plan (same point id appears once per plan that contains it). */
export type PointWithPlan = {
  point: FinishedPointType;
  vluchtnummers: string[];
  planId: number;
};

/** One row per geometry per plan (same geometry id appears once per plan that contains it). */
export type GeometryWithPlan = {
  geometry: FinishedGeometryType;
  vluchtnummers: string[];
  geometryLabel: string;
  planId: number;
};

export type SelectedListItem =
  | {
      key: string;
      type: "point";
      point: FinishedPointType;
      vluchtnummers: string[];
      planId: number;
    }
  | {
      key: string;
      type: "geometry";
      geometry: FinishedGeometryType;
      geometryLabel: string;
      vluchtnummers: string[];
      planId: number;
    };

export function collectSelectedDataFromPlan(
  plan: FinishedFlightPlanType
): { points: PointWithPlan[]; geometries: GeometryWithPlan[] } {
  const vn = plan.vluchtnummer || `Plan ${plan.id}`;
  const points: PointWithPlan[] = (plan.points_data || []).map((p) => ({
    point: p,
    vluchtnummers: [vn],
    planId: plan.id,
  }));

  const geometries: GeometryWithPlan[] = (plan.geometries || []).map((g) => ({
    geometry: g,
    vluchtnummers: [vn],
    geometryLabel:
      g.geometry_omschrijving || g.geometry_type || `Geometrie ${g.id}`,
    planId: plan.id,
  }));

  return { points, geometries };
}

export function collectSelectedData(
  plans: FinishedFlightPlanType[],
  selectedIds: number[]
): { points: PointWithPlan[]; geometries: GeometryWithPlan[] } {
  const points: PointWithPlan[] = [];
  const geometries: GeometryWithPlan[] = [];
  const selectedSet = new Set(selectedIds);

  for (const plan of plans) {
    if (!selectedSet.has(plan.id)) continue;
    const collected = collectSelectedDataFromPlan(plan);
    points.push(...collected.points);
    geometries.push(...collected.geometries);
  }

  return { points, geometries };
}

export function buildListItems(
  points: PointWithPlan[],
  geometries: GeometryWithPlan[]
): SelectedListItem[] {
  return [
    ...points.map(({ point, vluchtnummers, planId }) => ({
      key: `point-${point.id}-plan-${planId}`,
      type: "point" as const,
      point,
      vluchtnummers,
      planId,
    })),
    ...geometries.map(({ geometry, vluchtnummers, geometryLabel, planId }) => ({
      key: `geometry-${geometry.id}-plan-${planId}`,
      type: "geometry" as const,
      geometry,
      geometryLabel,
      vluchtnummers,
      planId,
    })),
  ];
}

export function clearRightListHover(layer: __esri.GraphicsLayer) {
  layer.graphics
    .toArray()
    .filter((g) => g.attributes?.label === TIMESLIDER_RIGHT_HOVER_LABEL)
    .forEach((g) => layer.remove(g));
}

export function drawGeometryHoverSkyBlue(
  layer: __esri.GraphicsLayer,
  geometry: FinishedGeometryType
) {
  const path = geometryPathFromPoints(geometry.points);
  if (path.length < 2) return;
  drawHover(
    layer,
    geometry,
    path,
    isPolygonGeometryType(geometry.geometry_type ?? undefined)
  );
}
