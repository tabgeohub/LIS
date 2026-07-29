import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { EnrichedPointType } from "Types";

export function computePointBounds(points: EnrichedPointType[]) {
  let minX = points[0].longitude;
  let maxX = points[0].longitude;
  let minY = points[0].latitude;
  let maxY = points[0].latitude;

  points.forEach((point) => {
    if (point.longitude < minX) minX = point.longitude;
    if (point.longitude > maxX) maxX = point.longitude;
    if (point.latitude < minY) minY = point.latitude;
    if (point.latitude > maxY) maxY = point.latitude;
  });

  return { minX, maxX, minY, maxY };
}

export function createQuadrantGraphic(hoveredPoints: EnrichedPointType[]) {
  const { minX, maxX, minY, maxY } = computePointBounds(hoveredPoints);
  const rings = [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
    [minX, minY],
  ];

  return new Graphic({
    geometry: new Polygon({
      spatialReference: { wkid: 4326 },
      rings: [rings],
    }),
    symbol: new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [227, 139, 79, 0.5], width: 1 },
    }),
  });
}
