import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import {
  closePolygonRing,
  geometryPathFromPoints,
  isPolygonGeometryType,
} from "@helpers/ArcGISHelpers/geometryPathFromPoints";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";

export const TIMESLIDER_RIGHT_HOVER_LABEL = "timeslider-right-list-hover";

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

export function drawHoverPin(input: {
  layer: __esri.GraphicsLayer;
  longitude: number;
  latitude: number;
  id?: number;
}) {
  const geometry = new Point({
    longitude: input.longitude,
    latitude: input.latitude,
    spatialReference: { wkid: 4326 },
  });

  const outerGraphic = new Graphic({
    geometry,
    symbol: new SimpleMarkerSymbol({
      style: "circle",
      color: [255, 255, 0, 0],
      size: 16,
      outline: {
        color: "#4ff1ff",
        width: 3,
      },
    }),
    attributes: {
      label: TIMESLIDER_RIGHT_HOVER_LABEL,
      id: input.id,
      kind: "hover-pin",
    },
  });

  const pinGraphic = new Graphic({
    geometry,
    symbol: new PictureMarkerSymbol({
      url: "/pin.png",
      width: "24px",
      height: "24px",
      yoffset: 9,
    }),
    attributes: {
      label: TIMESLIDER_RIGHT_HOVER_LABEL,
      id: input.id,
      kind: "hover-pin",
    },
  });

  input.layer.addMany([outerGraphic, pinGraphic]);
}

export function drawGeometryHoverSkyBlue(
  layer: __esri.GraphicsLayer,
  geometry: FinishedGeometryType
) {
  const path = geometryPathFromPoints(geometry.points);
  if (path.length < 2) return;

  const isPolygon = isPolygonGeometryType(geometry.geometry_type ?? undefined);

  if (isPolygon && path.length >= 3) {
    layer.add(
      new Graphic({
        geometry: new Polygon({
          rings: [closePolygonRing(path)],
          spatialReference: { wkid: 4326 },
        }),
        symbol: new SimpleFillSymbol({
          color: [79, 241, 255, 0.2],
          outline: { color: [79, 241, 255, 0.95], width: 3 },
          style: "solid",
        }),
        attributes: {
          label: TIMESLIDER_RIGHT_HOVER_LABEL,
          kind: "geometry",
          geometryId: geometry.id,
        },
      })
    );
    return;
  }

  layer.add(
    new Graphic({
      geometry: new Polyline({
        paths: [path],
        spatialReference: { wkid: 4326 },
      }),
      symbol: new SimpleLineSymbol({
        color: [79, 241, 255, 0.95],
        width: 3,
        style: "solid",
      }),
      attributes: {
        label: TIMESLIDER_RIGHT_HOVER_LABEL,
        kind: "geometry",
        geometryId: geometry.id,
      },
    })
  );
}
