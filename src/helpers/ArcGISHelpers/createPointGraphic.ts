import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { getTransformedCoordinates } from "./getTransformedCoordinates";
import { buildPointMarkerSymbol } from "./pointMarkerSymbol";

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
 * Gets coordinates from point data, with optional RD to WGS84 transformation
 */
export function getPointCoordinates(
  point: PointData,
  transformCoordinates: boolean = true
): { longitude: number; latitude: number } | null {
  let longitude: number | undefined = point.longitude;
  let latitude: number | undefined = point.latitude;

  if (
    transformCoordinates &&
    (typeof longitude !== "number" || typeof latitude !== "number") &&
    typeof point.xcoordinaat_rd === "number" &&
    typeof point.ycoordinaat_rd === "number"
  ) {
    const wgs = getTransformedCoordinates({
      fromProjection: "RD",
      toProjection: "WGS84",
      x: point.xcoordinaat_rd,
      y: point.ycoordinaat_rd,
    });
    longitude = wgs.x;
    latitude = wgs.y;
  }

  if (typeof longitude !== "number" || typeof latitude !== "number") {
    return null;
  }

  return { longitude, latitude };
}

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
