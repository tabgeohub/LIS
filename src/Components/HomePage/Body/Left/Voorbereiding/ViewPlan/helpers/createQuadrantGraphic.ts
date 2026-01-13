import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { EnrichedPointType } from "Types";

export function createQuadrantGraphic(hoveredPoints: EnrichedPointType[]) {
  let startX = hoveredPoints[0].longitude;
  let startY = hoveredPoints[0].latitude;

  let minX = startX;
  let maxX = startX;
  let minY = startY;
  let maxY = startY;

  hoveredPoints.forEach((point) => {
    if (point.longitude < minX) {
      minX = point.longitude;
    }
    if (point.longitude > maxX) {
      maxX = point.longitude;
    }
    if (point.latitude < minY) {
      minY = point.latitude;
    }
    if (point.latitude > maxY) {
      maxY = point.latitude;
    }
  });

  let rings = [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
    [minX, minY],
  ];

  const polygon = new Polygon({
    spatialReference: { wkid: 4326 },
    rings: [rings],
  });

  const quadrantGraphic = new Graphic({
    geometry: polygon,
    symbol: new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [227, 139, 79, 0.5], width: 1 },
    }),
  });

  return quadrantGraphic;
}
