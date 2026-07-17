import Graphic from "@arcgis/core/Graphic";
import {
  buildPolygonGraphic,
  buildPolylineGraphic,
  pointsToCoordinates,
  resolveGeometryGraphicAttributes,
} from "./geometryGraphicBuilders";
import type {
  BaseGeometryData,
  CreateGeometryGraphicOptions,
} from "./geometryGraphicTypes";
import { resolveGeometrySymbolOptions } from "./geometryGraphicSymbols";

export function createGeometryGraphic(
  geometry: BaseGeometryData,
  options: CreateGeometryGraphicOptions = {}
): Graphic | null {
  const {
    symbolOptions = {},
    attributes = {},
    transformCoordinates,
  } = options;

  const points = geometry.points;
  if (!points?.length) return null;

  const coordinates = pointsToCoordinates(points, transformCoordinates);
  if (coordinates.length === 0) return null;

  const finalSymbolOptions = resolveGeometrySymbolOptions(symbolOptions);
  const { attributes: baseAttributes, geometryType } =
    resolveGeometryGraphicAttributes(geometry);
  const graphicAttributes = { ...baseAttributes, ...attributes };

  if (geometryType === "polygon") {
    return buildPolygonGraphic({
      coordinates,
      symbolOptions: finalSymbolOptions,
      attributes: graphicAttributes,
    });
  }

  if (geometryType === "line") {
    return buildPolylineGraphic({
      coordinates,
      symbolOptions: finalSymbolOptions,
      attributes: graphicAttributes,
    });
  }

  return null;
}

export function createGeometryGraphics(
  geometries: BaseGeometryData[],
  options: CreateGeometryGraphicOptions = {}
): Graphic[] {
  return geometries
    .map((geometry) => createGeometryGraphic(geometry, options))
    .filter((graphic): graphic is Graphic => graphic !== null);
}
