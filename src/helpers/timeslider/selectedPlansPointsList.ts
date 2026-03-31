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

export type PointWithPlan = {
  point: FinishedPointType;
  vluchtnummer: string;
};

export type GeometryWithPlan = {
  geometry: FinishedGeometryType;
  vluchtnummer: string;
  geometryLabel: string;
};

export type SelectedListItem =
  | {
      key: string;
      type: "point";
      point: FinishedPointType;
      vluchtnummer: string;
    }
  | {
      key: string;
      type: "geometry";
      geometry: FinishedGeometryType;
      geometryLabel: string;
      vluchtnummer: string;
    };

export function collectSelectedData(
  plans: FinishedFlightPlanType[],
  selectedIds: number[]
): { points: PointWithPlan[]; geometries: GeometryWithPlan[] } {
  const points: PointWithPlan[] = [];
  const geometries: GeometryWithPlan[] = [];
  const selectedSet = new Set(selectedIds);

  for (const plan of plans) {
    if (!selectedSet.has(plan.id)) continue;
    const vn = plan.vluchtnummer || `Plan ${plan.id}`;

    for (const p of plan.points_data || []) {
      points.push({ point: p, vluchtnummer: vn });
    }

    for (const g of plan.geometries || []) {
      const label =
        g.geometry_omschrijving || g.geometry_type || `Geometrie ${g.id}`;
      geometries.push({ geometry: g, vluchtnummer: vn, geometryLabel: label });
    }
  }

  return { points, geometries };
}

export function buildListItems(
  points: PointWithPlan[],
  geometries: GeometryWithPlan[]
): SelectedListItem[] {
  return [
    ...points.map(({ point, vluchtnummer }, idx) => ({
      key: `point-${point.id}-${idx}`,
      type: "point" as const,
      point,
      vluchtnummer,
    })),
    ...geometries.map(({ geometry, vluchtnummer, geometryLabel }, idx) => ({
      key: `geometry-${geometry.id}-${idx}`,
      type: "geometry" as const,
      geometry,
      geometryLabel,
      vluchtnummer,
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
