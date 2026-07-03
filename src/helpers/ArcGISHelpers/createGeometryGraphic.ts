import Graphic from "@arcgis/core/Graphic";
import {
  buildPolygonGraphic,
  buildPolylineGraphic,
  pointsToCoordinates,
  resolveGeometryGraphicAttributes,
} from "./geometryGraphicBuilders";

/**
 * Point interface for geometry points
 */
export interface GeometryPoint {
  longitude: number;
  latitude: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
}

/**
 * Base geometry data structure
 */
export interface BaseGeometryData {
  id?: number;
  type?: "polygon" | "line";
  geometry_type?: "polygon" | "line";
  points?: GeometryPoint[];
  omschrijving?: string;
  geometry_omschrijving?: string;
  [key: string]: any; // Allow additional attributes
}

/**
 * Symbol options for geometry rendering
 */
export interface GeometrySymbolOptions {
  fillColor?: [number, number, number, number]; // RGBA for polygon fill
  outlineColor?: [number, number, number, number]; // RGBA for polygon outline
  lineColor?: [number, number, number, number]; // RGBA for line
  outlineWidth?: number;
  lineWidth?: number;
}

/**
 * Options for creating geometry graphic
 */
export interface CreateGeometryGraphicOptions {
  symbolOptions?: GeometrySymbolOptions;
  attributes?: Record<string, any>; // Additional attributes to add to graphic
  transformCoordinates?: (point: GeometryPoint) => [number, number] | null; // Optional coordinate transformation
}

/** Blue starred geometry on the bottom table map layer */
export const GEOMETRY_STAR_SYMBOL: GeometrySymbolOptions = {
  fillColor: [0, 0, 255, 0.3],
  outlineColor: [0, 0, 255, 1],
  lineColor: [0, 0, 255, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

/** Yellow hover highlight in the bottom geometries table */
export const GEOMETRY_TABLE_HOVER_SYMBOL: GeometrySymbolOptions = {
  fillColor: [255, 255, 0, 0.5],
  outlineColor: [255, 255, 0, 1],
  lineColor: [255, 255, 0, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

/** Yellow selection sync for geometries tab / table */
export const GEOMETRY_TABLE_YELLOW_SYMBOL: GeometrySymbolOptions = {
  fillColor: [255, 255, 0, 0.3],
  outlineColor: [255, 255, 0, 1],
  lineColor: [255, 255, 0, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

/** Yellow selection outline (finished-plan list click, flight-plan multi-select) */
export const GEOMETRY_SELECTION_SYMBOL: GeometrySymbolOptions = {
  fillColor: [0, 0, 0, 0],
  outlineColor: [255, 255, 0, 1],
  lineColor: [255, 255, 0, 1],
  outlineWidth: 3,
  lineWidth: 4,
};

/** Orange geometry outline for PDF report map rendering */
export const GEOMETRY_REPORT_SYMBOL: GeometrySymbolOptions = {
  fillColor: [255, 140, 0, 0.5],
  outlineColor: [255, 140, 0, 1],
  lineColor: [255, 140, 0, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

/**
 * Default symbol options (blue)
 */
const DEFAULT_SYMBOL_OPTIONS: Required<GeometrySymbolOptions> = {
  fillColor: [0, 0, 0, 0], // Transparent fill
  outlineColor: [0, 0, 255, 1], // Blue outline
  lineColor: [0, 0, 255, 1], // Blue line
  outlineWidth: 2,
  lineWidth: 3,
};

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

  const finalSymbolOptions: Required<GeometrySymbolOptions> = {
    fillColor: symbolOptions.fillColor ?? DEFAULT_SYMBOL_OPTIONS.fillColor,
    outlineColor:
      symbolOptions.outlineColor ?? DEFAULT_SYMBOL_OPTIONS.outlineColor,
    lineColor: symbolOptions.lineColor ?? DEFAULT_SYMBOL_OPTIONS.lineColor,
    outlineWidth:
      symbolOptions.outlineWidth ?? DEFAULT_SYMBOL_OPTIONS.outlineWidth,
    lineWidth: symbolOptions.lineWidth ?? DEFAULT_SYMBOL_OPTIONS.lineWidth,
  };

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

/**
 * Creates multiple Graphic objects from an array of geometries
 * @param geometries - Array of geometry data objects
 * @param options - Options for creating the graphics
 * @returns Array of Graphic objects (invalid geometries are filtered out)
 */
export function createGeometryGraphics(
  geometries: BaseGeometryData[],
  options: CreateGeometryGraphicOptions = {}
): Graphic[] {
  return geometries
    .map((geometry) => createGeometryGraphic(geometry, options))
    .filter((graphic): graphic is Graphic => graphic !== null);
}

