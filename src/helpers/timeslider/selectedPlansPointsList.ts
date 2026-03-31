import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import {
  FinishedFlightPlanType,
  FinishedPointType,
  FinishedGeometryType,
} from "Types/finished_plans";

export const TIMESLIDER_RIGHT_HOVER_LABEL = "timeslider-right-list-hover";

/** One row per unique point id; vluchtnummers = distinct plans that include this point. */
export type PointWithPlan = {
  point: FinishedPointType;
  vluchtnummers: string[];
};

/** One row per unique geometry id; vluchtnummers = distinct plans that include this geometry. */
export type GeometryWithPlan = {
  geometry: FinishedGeometryType;
  vluchtnummers: string[];
  geometryLabel: string;
};

export type SelectedListItem =
  | {
      key: string;
      type: "point";
      point: FinishedPointType;
      vluchtnummers: string[];
    }
  | {
      key: string;
      type: "geometry";
      geometry: FinishedGeometryType;
      geometryLabel: string;
      vluchtnummers: string[];
    };

function appendUnique(list: string[], value: string) {
  if (!list.includes(value)) list.push(value);
}

export function collectSelectedData(
  plans: FinishedFlightPlanType[],
  selectedIds: number[]
): { points: PointWithPlan[]; geometries: GeometryWithPlan[] } {
  const pointMap = new Map<
    number,
    { point: FinishedPointType; vluchtnummers: string[] }
  >();
  const geometryMap = new Map<
    number,
    { geometry: FinishedGeometryType; vluchtnummers: string[]; geometryLabel: string }
  >();
  const selectedSet = new Set(selectedIds);

  for (const plan of plans) {
    if (!selectedSet.has(plan.id)) continue;
    const vn = plan.vluchtnummer || `Plan ${plan.id}`;

    for (const p of plan.points_data || []) {
      const existing = pointMap.get(p.id);
      if (!existing) {
        pointMap.set(p.id, { point: p, vluchtnummers: [vn] });
      } else {
        appendUnique(existing.vluchtnummers, vn);
      }
    }

    for (const g of plan.geometries || []) {
      const label =
        g.geometry_omschrijving || g.geometry_type || `Geometrie ${g.id}`;
      const existing = geometryMap.get(g.id);
      if (!existing) {
        geometryMap.set(g.id, {
          geometry: g,
          vluchtnummers: [vn],
          geometryLabel: label,
        });
      } else {
        appendUnique(existing.vluchtnummers, vn);
      }
    }
  }

  return {
    points: Array.from(pointMap.values()),
    geometries: Array.from(geometryMap.values()),
  };
}

export function buildListItems(
  points: PointWithPlan[],
  geometries: GeometryWithPlan[]
): SelectedListItem[] {
  return [
    ...points.map(({ point, vluchtnummers }) => ({
      key: `point-${point.id}`,
      type: "point" as const,
      point,
      vluchtnummers,
    })),
    ...geometries.map(({ geometry, vluchtnummers, geometryLabel }) => ({
      key: `geometry-${geometry.id}`,
      type: "geometry" as const,
      geometry,
      geometryLabel,
      vluchtnummers,
    })),
  ];
}

export function clearRightListHover(layer: __esri.GraphicsLayer) {
  layer.graphics
    .toArray()
    .filter((g) => g.attributes?.label === TIMESLIDER_RIGHT_HOVER_LABEL)
    .forEach((g) => layer.remove(g));
}

export function drawHoverPin(
  layer: __esri.GraphicsLayer,
  longitude: number,
  latitude: number,
  id?: number
) {
  const geometry = new Point({
    longitude,
    latitude,
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
      id,
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
      id,
      kind: "hover-pin",
    },
  });

  layer.addMany([outerGraphic, pinGraphic]);
}

export function drawGeometryHoverSkyBlue(
  layer: __esri.GraphicsLayer,
  geometry: FinishedGeometryType
) {
  const path = (geometry.points || [])
    .map((p) => getPointCoordinates(p, true))
    .filter((c): c is { longitude: number; latitude: number } => c != null)
    .map((c) => [c.longitude, c.latitude] as [number, number]);

  if (path.length < 2) return;

  const isPolygon = (geometry.geometry_type || "")
    .toLowerCase()
    .includes("polygon");

  if (isPolygon && path.length >= 3) {
    const ring = [...path];
    const [firstX, firstY] = ring[0];
    const [lastX, lastY] = ring[ring.length - 1];
    if (firstX !== lastX || firstY !== lastY) ring.push([firstX, firstY]);

    layer.add(
      new Graphic({
        geometry: new Polygon({
          rings: [ring],
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
