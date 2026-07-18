import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import type { PointFormState } from "../helpers/pointForm";
import { toStr } from "./coords";

export function readFiniteLonLat(
  mapPoint: { longitude?: number; latitude?: number } | null | undefined
): { lon: number; lat: number } | null {
  const lon = mapPoint?.longitude;
  const lat = mapPoint?.latitude;
  if (
    typeof lon !== "number" ||
    typeof lat !== "number" ||
    !Number.isFinite(lon) ||
    !Number.isFinite(lat)
  ) {
    return null;
  }
  return { lon, lat };
}

export function placeClickPointGraphic(input: {
  lon: number;
  lat: number;
  mapView: __esri.MapView;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  const pointGraphic = createPoint(input.lon, input.lat);
  input.redGraphicsLayer?.removeAll();
  if (input.redGraphicsLayer) {
    input.redGraphicsLayer.add(pointGraphic);
  } else {
    input.mapView.graphics.add(pointGraphic);
  }
}

export function patchCoordsFromLonLat(
  lon: number,
  lat: number,
  patch: (p: Partial<PointFormState>) => void
) {
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: lon,
    y: lat,
  });
  patch({
    longitude: toStr(lon),
    latitude: toStr(lat),
    xcoordinaat_rd: toStr(transformed.x),
    ycoordinaat_rd: toStr(transformed.y),
  });
}
