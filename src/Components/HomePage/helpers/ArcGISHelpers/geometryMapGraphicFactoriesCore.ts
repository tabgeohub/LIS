import {
  BaseGeometryData,
  createGeometryGraphic,
  GEOMETRY_SELECTION_SYMBOL,
  GEOMETRY_STAR_SYMBOL,
  GEOMETRY_TABLE_HOVER_SYMBOL,
  GEOMETRY_TABLE_YELLOW_SYMBOL,
} from "Components/HomePage/helpers/ArcGISHelpers/createGeometryGraphic";

/** Compatible with DB `Geometry` and `FinishedGeometryType`. */
export type ClickableGeometry = {
  id: number;
  type?: "polygon" | "line";
  geometry_type?: "polygon" | "line" | string | null;
  omschrijving?: string;
  geometry_omschrijving?: string | null;
  points?: BaseGeometryData["points"];
};

export function normalizeGeometryData(
  geometry: ClickableGeometry
): BaseGeometryData {
  const geometryType = (geometry.type || geometry.geometry_type) as
    | "polygon"
    | "line"
    | undefined;

  return {
    id: geometry.id,
    type: geometryType,
    geometry_type: geometryType,
    omschrijving:
      geometry.omschrijving || geometry.geometry_omschrijving || undefined,
    points: geometry.points,
  };
}

export function createSelectionGeometryGraphic(
  geometry: ClickableGeometry,
  attributes?: Record<string, any>
) {
  return createGeometryGraphic(normalizeGeometryData(geometry), {
    symbolOptions: GEOMETRY_SELECTION_SYMBOL,
    attributes,
  });
}

export function calculateGeometryCentroid(
  geometry: BaseGeometryData
): { longitude: number; latitude: number } | null {
  if (!geometry.points || geometry.points.length === 0) return null;

  const sum = geometry.points.reduce(
    (acc, point) => {
      acc.lon += point.longitude;
      acc.lat += point.latitude;
      return acc;
    },
    { lon: 0, lat: 0 }
  );

  return {
    longitude: sum.lon / geometry.points.length,
    latitude: sum.lat / geometry.points.length,
  };
}

export function createStarGeometryGraphic(geometry: BaseGeometryData) {
  return createGeometryGraphic(geometry, {
    symbolOptions: GEOMETRY_STAR_SYMBOL,
    attributes: { geometryId: geometry.id },
  });
}

export function createHoverGeometryTableGraphic(geometry: BaseGeometryData) {
  return createGeometryGraphic(geometry, {
    symbolOptions: GEOMETRY_TABLE_HOVER_SYMBOL,
  });
}

export function createYellowGeometryTableGraphic(geometry: BaseGeometryData) {
  return createGeometryGraphic(geometry, {
    symbolOptions: GEOMETRY_TABLE_YELLOW_SYMBOL,
    attributes: {
      geometryId: geometry.id,
      type: "geometry",
    },
  });
}
