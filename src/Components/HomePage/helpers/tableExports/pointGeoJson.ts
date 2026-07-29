import type {
  Feature,
  FeatureCollection,
  Point as GeoPoint,
} from "geojson";
import type { EnrichedPointType } from "Types";

export function enrichedPointToFeature(
  point: EnrichedPointType
): Feature<GeoPoint> {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
    properties: { ...point },
  };
}

export function enrichedPointToExportFeature(point: EnrichedPointType) {
  return {
    ...enrichedPointToFeature(point),
    properties: {
      id: point.id,
      omschrijving: point.omschrijving,
      regio_id: point.regio_id,
      datum: point.datum,
      vertrouwelijk: point.vertrouwelijk,
      order: point.order,
      region: point.region,
    },
  };
}

export function enrichedPointsToFeatureCollection(
  points: EnrichedPointType[]
): FeatureCollection<GeoPoint> {
  return {
    type: "FeatureCollection",
    features: points.map(enrichedPointToFeature),
  };
}
