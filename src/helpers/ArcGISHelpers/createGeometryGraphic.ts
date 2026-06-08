import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

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

/**
 * Converts geometry points to coordinate array
 * @param points - Array of geometry points
 * @param transformCoordinates - Optional function to transform coordinates
 * @returns Array of [longitude, latitude] coordinates
 */
function pointsToCoordinates(
  points: GeometryPoint[],
  transformCoordinates?: (point: GeometryPoint) => [number, number] | null
): [number, number][] {
  if (!points || points.length === 0) return [];

  return points
    .map((point) => {
      if (transformCoordinates) {
        return transformCoordinates(point);
      }

      // Default: use longitude/latitude directly
      if (
        typeof point.longitude === "number" &&
        typeof point.latitude === "number"
      ) {
        return [point.longitude, point.latitude] as [number, number];
      }

      return null;
    })
    .filter((coord): coord is [number, number] => coord !== null);
}

/**
 * Closes a polygon ring by ensuring first and last points are the same
 * @param ring - Array of coordinates
 * @returns Closed ring
 */
function closePolygonRing(ring: [number, number][]): [number, number][] {
  if (ring.length === 0) return ring;

  const first = ring[0];
  const last = ring[ring.length - 1];

  // If ring is not closed, close it
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...ring, [first[0], first[1]]];
  }

  return ring;
}

/**
 * Creates a Graphic object from geometry data
 * @param geometry - Geometry data object
 * @param options - Options for creating the graphic
 * @returns Graphic object or null if geometry is invalid
 */
export function createGeometryGraphic(
  geometry: BaseGeometryData,
  options: CreateGeometryGraphicOptions = {}
): Graphic | null {
  const {
    symbolOptions = {},
    attributes = {},
    transformCoordinates,
  } = options;

  // Determine geometry type
  const geometryType =
    geometry.type || geometry.geometry_type || "polygon";

  // Get points
  const points = geometry.points;
  if (!points || points.length === 0) {
    return null;
  }

  // Convert points to coordinates
  const coordinates = pointsToCoordinates(points, transformCoordinates);
  if (coordinates.length === 0) {
    return null;
  }

  // Merge symbol options with defaults
  const finalSymbolOptions: Required<GeometrySymbolOptions> = {
    fillColor:
      symbolOptions.fillColor ?? DEFAULT_SYMBOL_OPTIONS.fillColor,
    outlineColor:
      symbolOptions.outlineColor ?? DEFAULT_SYMBOL_OPTIONS.outlineColor,
    lineColor: symbolOptions.lineColor ?? DEFAULT_SYMBOL_OPTIONS.lineColor,
    outlineWidth:
      symbolOptions.outlineWidth ?? DEFAULT_SYMBOL_OPTIONS.outlineWidth,
    lineWidth: symbolOptions.lineWidth ?? DEFAULT_SYMBOL_OPTIONS.lineWidth,
  };

  // Build attributes object
  const geometryId = geometry.id;
  const omschrijving =
    geometry.omschrijving || geometry.geometry_omschrijving || "";

  const graphicAttributes: Record<string, any> = {
    id: geometryId,
    geometryId: geometryId,
    geometryType: geometryType,
    omschrijving: omschrijving,
    type: "geometry",
    ...attributes, // Allow overriding with custom attributes
  };

  // Create geometry and symbol based on type
  if (geometryType === "polygon") {
    const ring = closePolygonRing(coordinates);

    const polygon = new Polygon({
      rings: [ring],
      spatialReference: { wkid: 4326 },
    });

    const fillSymbol = new SimpleFillSymbol({
      color: finalSymbolOptions.fillColor,
      outline: {
        color: finalSymbolOptions.outlineColor,
        width: finalSymbolOptions.outlineWidth,
      },
    });

    return new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
      attributes: graphicAttributes,
    });
  } else if (geometryType === "line") {
    const polyline = new Polyline({
      paths: [coordinates],
      spatialReference: { wkid: 4326 },
    });

    const lineSymbol = new SimpleLineSymbol({
      color: finalSymbolOptions.lineColor,
      width: finalSymbolOptions.lineWidth,
    });

    return new Graphic({
      geometry: polyline,
      symbol: lineSymbol,
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

