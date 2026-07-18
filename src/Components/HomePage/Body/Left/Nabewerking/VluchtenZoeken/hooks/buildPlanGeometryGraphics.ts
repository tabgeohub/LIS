import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import {
  createGeometryGraphic,
  GeometryPoint,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import type { FinishedGeometryType } from "Types/finished_plans";

function transformPlanGeometryPoint(
  point: GeometryPoint
): [number, number] | null {
  const coords = getPointCoordinates(point);
  if (!coords) return null;
  return [coords.longitude, coords.latitude];
}

function normalizeGeometryType(
  geometryType: FinishedGeometryType["geometry_type"]
): "polygon" | "line" | undefined {
  if (geometryType === "polygon" || geometryType === "line") {
    return geometryType;
  }
  return undefined;
}

export function graphicFromPlanGeometry(
  geometry: FinishedGeometryType
): __esri.Graphic | null {
  if (!geometry.points || geometry.points.length === 0) return null;

  return createGeometryGraphic(
    {
      id: geometry.id,
      geometry_type: normalizeGeometryType(geometry.geometry_type),
      geometry_omschrijving: geometry.geometry_omschrijving ?? undefined,
      points: geometry.points,
    },
    {
      transformCoordinates: transformPlanGeometryPoint,
      attributes: {
        geometryId: geometry.id,
        geometryType: geometry.geometry_type ?? undefined,
        omschrijving: geometry.geometry_omschrijving ?? undefined,
        type: "geometry",
      },
    }
  );
}

export function buildPlanGeometryGraphics(
  geometries: FinishedGeometryType[]
): __esri.Graphic[] {
  const graphics: __esri.Graphic[] = [];
  for (const geometry of geometries) {
    const graphic = graphicFromPlanGeometry(geometry);
    if (graphic) graphics.push(graphic);
  }
  return graphics;
}
