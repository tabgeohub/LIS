import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import createPoint from "Components/HomePage/helpers/ArcGISHelpers/createPoint";
import type { PointFormState } from "../helpers/pointForm";
import { toStr } from "./coords";

export function readFiniteLonLat(options: {
  mapPoint: { longitude?: number; latitude?: number } | null | undefined;
}): { lon: number; lat: number } | null {
  const lon = options.mapPoint?.longitude;
  const lat = options.mapPoint?.latitude;
  if (typeof lon !== "number" || typeof lat !== "number") return null;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
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

export function patchCoordsFromLonLat(input: {
  lon: number;
  lat: number;
  patch: (p: Partial<PointFormState>) => void;
}) {
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.lon,
    y: input.lat,
  });
  input.patch({
    longitude: toStr(input.lon),
    latitude: toStr(input.lat),
    xcoordinaat_rd: toStr(transformed.x),
    ycoordinaat_rd: toStr(transformed.y),
  });
}
