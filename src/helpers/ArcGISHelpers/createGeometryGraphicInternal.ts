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

  const coordinates = pointsToCoordinates({ points, transformCoordinates });
  if (coordinates.length === 0) return null;

  const finalSymbolOptions = resolveGeometrySymbolOptions(symbolOptions);
  const { attributes: baseAttributes, geometryType } =
    resolveGeometryGraphicAttributes(geometry);
  const graphicAttributes = { ...baseAttributes, ...attributes };

  return buildGraphicForGeometryType({
    geometryType,
    coordinates,
    symbolOptions: finalSymbolOptions,
    attributes: graphicAttributes,
  });
}

function buildGraphicForGeometryType(input: {
  geometryType: string | undefined;
  coordinates: number[][];
  symbolOptions: ReturnType<typeof resolveGeometrySymbolOptions>;
  attributes: Record<string, unknown>;
}): Graphic | null {
  if (input.geometryType === "polygon") {
    return buildPolygonGraphic({
      coordinates: input.coordinates,
      symbolOptions: input.symbolOptions,
      attributes: input.attributes,
    });
  }

  if (input.geometryType === "line") {
    return buildPolylineGraphic({
      coordinates: input.coordinates,
      symbolOptions: input.symbolOptions,
      attributes: input.attributes,
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
