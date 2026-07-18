import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { buildPointMarkerSymbol } from "./pointMarkerSymbol";
import { getPointCoordinates } from "./pointGraphicCoordinates";
import type {
  CreatePointGraphicOptions,
  PointData,
} from "./pointGraphicTypes";

export function createPointGraphic(
  point: PointData,
  options: CreatePointGraphicOptions = {}
): Graphic | null {
  const {
    symbolOptions = {},
    attributes = {},
    transformCoordinates = true,
  } = options;

  const coords = getPointCoordinates(point, transformCoordinates);
  if (!coords) return null;

  return new Graphic({
    geometry: new Point({
      longitude: coords.longitude,
      latitude: coords.latitude,
      spatialReference: { wkid: 4326 },
    }),
    symbol: buildPointMarkerSymbol(symbolOptions),
    attributes: {
      id: point.id,
      omschrijving: point.omschrijving,
      ...attributes,
    },
  });
}

export function createPointGraphics(
  points: PointData[],
  options: CreatePointGraphicOptions = {}
): Graphic[] {
  return points
    .map((point) => createPointGraphic(point, options))
    .filter((graphic): graphic is Graphic => graphic !== null);
}
