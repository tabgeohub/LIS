import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import type {
  BaseGeometryData,
  GeometryPoint,
  GeometrySymbolOptions,
} from "./createGeometryGraphic";

export function pointsToCoordinates(
  points: GeometryPoint[],
  transformCoordinates?: (point: GeometryPoint) => [number, number] | null
): [number, number][] {
  if (!points?.length) return [];

  return points
    .map((point) => {
      if (transformCoordinates) return transformCoordinates(point);
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

function closePolygonRing(ring: [number, number][]) {
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) return ring;
  return [...ring, [first[0], first[1]]];
}

export function buildPolygonGraphic(input: {
  coordinates: [number, number][];
  symbolOptions: Required<GeometrySymbolOptions>;
  attributes: Record<string, unknown>;
}) {
  const polygon = new Polygon({
    rings: [closePolygonRing(input.coordinates)],
    spatialReference: { wkid: 4326 },
  });

  return new Graphic({
    geometry: polygon,
    symbol: new SimpleFillSymbol({
      color: input.symbolOptions.fillColor,
      outline: {
        color: input.symbolOptions.outlineColor,
        width: input.symbolOptions.outlineWidth,
      },
    }),
    attributes: input.attributes,
  });
}

export function buildPolylineGraphic(input: {
  coordinates: [number, number][];
  symbolOptions: Required<GeometrySymbolOptions>;
  attributes: Record<string, unknown>;
}) {
  const polyline = new Polyline({
    paths: [input.coordinates],
    spatialReference: { wkid: 4326 },
  });

  return new Graphic({
    geometry: polyline,
    symbol: new SimpleLineSymbol({
      color: input.symbolOptions.lineColor,
      width: input.symbolOptions.lineWidth,
    }),
    attributes: input.attributes,
  });
}

export function resolveGeometryGraphicAttributes(geometry: BaseGeometryData) {
  const geometryId = geometry.id;
  const geometryType = geometry.type || geometry.geometry_type || "polygon";
  return {
    attributes: {
      id: geometryId,
      geometryId,
      geometryType,
      omschrijving: geometry.omschrijving || geometry.geometry_omschrijving || "",
      type: "geometry",
    },
    geometryType,
  };
}
