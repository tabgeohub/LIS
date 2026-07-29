import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import {
  createGeometryGraphic,
  GeometryPoint,
} from "Components/HomePage/helpers/ArcGISHelpers/createGeometryGraphic";
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

function coalesceUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

function planGeometryAttributes(geometry: FinishedGeometryType) {
  return {
    geometryId: geometry.id,
    geometryType: coalesceUndefined(geometry.geometry_type),
    omschrijving: coalesceUndefined(geometry.geometry_omschrijving),
    type: "geometry" as const,
  };
}

export function graphicFromPlanGeometry(
  geometry: FinishedGeometryType
): __esri.Graphic | null {
  if (!geometry.points || geometry.points.length === 0) return null;

  return createGeometryGraphic(
    {
      id: geometry.id,
      geometry_type: normalizeGeometryType(geometry.geometry_type),
      geometry_omschrijving: coalesceUndefined(geometry.geometry_omschrijving),
      points: geometry.points,
    },
    {
      transformCoordinates: transformPlanGeometryPoint,
      attributes: planGeometryAttributes(geometry),
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
