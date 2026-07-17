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

export function buildPlanGeometryGraphics(
  geometries: FinishedGeometryType[]
): __esri.Graphic[] {
  const graphics: __esri.Graphic[] = [];

  geometries.forEach((geometry) => {
    if (!geometry.points || geometry.points.length === 0) return;

    const graphic = createGeometryGraphic(
      {
        id: geometry.id,
        geometry_type:
          geometry.geometry_type === "polygon" ||
          geometry.geometry_type === "line"
            ? geometry.geometry_type
            : undefined,
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

    if (graphic) {
      graphics.push(graphic);
    }
  });

  return graphics;
}
