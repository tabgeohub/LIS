import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { createGeometryGraphic } from "Components/HomePage/helpers/ArcGISHelpers/createGeometryGraphic";
import { createYellowWgs84PointGraphic } from "Components/HomePage/helpers/ArcGISHelpers/createYellowWgs84PointGraphic";
import { Geometry } from "hooks/features/useGeometriesStore";
import { EnrichedPointType } from "Types";

const YELLOW_GEOMETRY_SYMBOL = {
  fillColor: [255, 255, 0, 0.3] as [number, number, number, number],
  outlineColor: [255, 255, 0, 1] as [number, number, number, number],
  lineColor: [255, 255, 0, 1] as [number, number, number, number],
  outlineWidth: 2,
  lineWidth: 3,
};

export function drawYellowPoint(
  point: EnrichedPointType,
  yellowGraphicsLayer: __esri.GraphicsLayer | null
) {
  const coords = getPointCoordinates(point);
  if (!coords || !yellowGraphicsLayer) return;

  yellowGraphicsLayer.add(
    createYellowWgs84PointGraphic({
      longitude: coords.longitude,
      latitude: coords.latitude,
      attributes: point,
    })
  );
}

export function drawYellowGeometries(
  geometries: Geometry[],
  yellowGraphicsLayer: __esri.GraphicsLayer | null
) {
  if (!yellowGraphicsLayer) return;

  const existing = yellowGraphicsLayer.graphics.toArray();
  const geometryGraphics = existing.filter(
    (g) => g.attributes?.type === "geometry"
  );
  geometryGraphics.forEach((g) => yellowGraphicsLayer.remove(g));

  for (const geometry of geometries) {
    if (!geometry.points?.length) continue;

    const graphic = createGeometryGraphic(geometry, {
      symbolOptions: YELLOW_GEOMETRY_SYMBOL,
      attributes: {
        geometryId: geometry.id,
        geometryType: geometry.type,
        omschrijving: geometry.omschrijving,
        type: "geometry",
      },
    });

    if (graphic) {
      yellowGraphicsLayer.add(graphic);
    }
  }
}
