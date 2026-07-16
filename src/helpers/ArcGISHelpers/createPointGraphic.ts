import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { buildPointMarkerSymbol } from "./pointMarkerSymbol";
import { getPointCoordinates } from "./pointGraphicCoordinates";
import type {
  CreatePointGraphicOptions,
  PointData,
} from "./pointGraphicTypes";

export { getPointCoordinates } from "./pointGraphicCoordinates";
export type {
  CreatePointGraphicOptions,
  PointData,
  PointSymbolOptions,
} from "./pointGraphicTypes";

/**
 * Creates a Graphic object from point data
 */
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

  const pointGeometry = new Point({
    longitude: coords.longitude,
    latitude: coords.latitude,
    spatialReference: { wkid: 4326 },
  });

  const graphicAttributes: Record<string, any> = {
    id: point.id,
    omschrijving: point.omschrijving,
    ...attributes,
  };

  return new Graphic({
    geometry: pointGeometry,
    symbol: buildPointMarkerSymbol(symbolOptions),
    attributes: graphicAttributes,
  });
}

/**
 * Creates multiple Graphic objects from an array of points
 */
export function createPointGraphics(
  points: PointData[],
  options: CreatePointGraphicOptions = {}
): Graphic[] {
  return points
    .map((point) => createPointGraphic(point, options))
    .filter((graphic): graphic is Graphic => graphic !== null);
}
