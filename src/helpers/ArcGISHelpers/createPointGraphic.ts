import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getTransformedCoordinates } from "./getTransformedCoordinates";

/**
 * Point data interface
 */
export interface PointData {
  id?: number;
  longitude?: number;
  latitude?: number;
  xcoordinaat_rd?: number;
  ycoordinaat_rd?: number;
  omschrijving?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Symbol options for point rendering
 */
export interface PointSymbolOptions {
  color?: string | [number, number, number, number]; // Color for marker
  size?: number; // Size of marker
  style?: "circle" | "square" | "cross" | "x" | "diamond" | "triangle";
  outlineColor?: string | [number, number, number, number]; // Outline color
  outlineWidth?: number; // Outline width
}

/**
 * Options for creating point graphic
 */
export interface CreatePointGraphicOptions {
  symbolOptions?: PointSymbolOptions;
  attributes?: Record<string, any>; // Additional attributes to add to graphic
  transformCoordinates?: boolean; // Whether to transform RD to WGS84 if needed
}

/**
 * Default symbol options (blue marker)
 */
const DEFAULT_SYMBOL_OPTIONS: Required<PointSymbolOptions> = {
  color: "blue",
  size: 12,
  style: "circle",
  outlineColor: "white",
  outlineWidth: 1,
};

/**
 * Gets coordinates from point data, with optional RD to WGS84 transformation
 * @param point - Point data object
 * @param transformCoordinates - Whether to transform coordinates if needed
 * @returns Object with longitude and latitude, or null if invalid
 */
function getPointCoordinates(
  point: PointData,
  transformCoordinates: boolean = true
): { longitude: number; latitude: number } | null {
  let longitude: number | undefined = point.longitude;
  let latitude: number | undefined = point.latitude;

  // If coordinates are missing and RD coordinates exist, transform them
  if (
    transformCoordinates &&
    (typeof longitude !== "number" || typeof latitude !== "number") &&
    typeof point.xcoordinaat_rd === "number" &&
    typeof point.ycoordinaat_rd === "number"
  ) {
    const wgs = getTransformedCoordinates(
      "RD",
      "WGS84",
      point.xcoordinaat_rd,
      point.ycoordinaat_rd
    );
    longitude = wgs.x;
    latitude = wgs.y;
  }

  // Validate coordinates
  if (typeof longitude !== "number" || typeof latitude !== "number") {
    return null;
  }

  return { longitude, latitude };
}

/**
 * Creates a Graphic object from point data
 * @param point - Point data object
 * @param options - Options for creating the graphic
 * @returns Graphic object or null if point is invalid
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

  // Get coordinates
  const coords = getPointCoordinates(point, transformCoordinates);
  if (!coords) {
    return null;
  }

  // Merge symbol options with defaults
  const finalSymbolOptions: Required<PointSymbolOptions> = {
    color: symbolOptions.color ?? DEFAULT_SYMBOL_OPTIONS.color,
    size: symbolOptions.size ?? DEFAULT_SYMBOL_OPTIONS.size,
    style: symbolOptions.style ?? DEFAULT_SYMBOL_OPTIONS.style,
    outlineColor:
      symbolOptions.outlineColor ?? DEFAULT_SYMBOL_OPTIONS.outlineColor,
    outlineWidth:
      symbolOptions.outlineWidth ?? DEFAULT_SYMBOL_OPTIONS.outlineWidth,
  };

  // Create point geometry
  const pointGeometry = new Point({
    longitude: coords.longitude,
    latitude: coords.latitude,
    spatialReference: { wkid: 4326 },
  });

  // Create symbol
  const symbol = new SimpleMarkerSymbol({
    color: finalSymbolOptions.color,
    size: finalSymbolOptions.size,
    style: finalSymbolOptions.style,
    outline: {
      color: finalSymbolOptions.outlineColor,
      width: finalSymbolOptions.outlineWidth,
    },
  });

  // Build attributes object
  const graphicAttributes: Record<string, any> = {
    id: point.id,
    omschrijving: point.omschrijving,
    ...attributes, // Allow overriding with custom attributes
  };

  return new Graphic({
    geometry: pointGeometry,
    symbol: symbol,
    attributes: graphicAttributes,
  });
}

/**
 * Creates multiple Graphic objects from an array of points
 * @param points - Array of point data objects
 * @param options - Options for creating the graphics
 * @returns Array of Graphic objects (invalid points are filtered out)
 */
export function createPointGraphics(
  points: PointData[],
  options: CreatePointGraphicOptions = {}
): Graphic[] {
  return points
    .map((point) => createPointGraphic(point, options))
    .filter((graphic): graphic is Graphic => graphic !== null);
}

