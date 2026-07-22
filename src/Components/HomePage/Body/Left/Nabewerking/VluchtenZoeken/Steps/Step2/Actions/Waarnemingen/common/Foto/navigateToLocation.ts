import Point from "@arcgis/core/geometry/Point";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { replaceImageLocationMarker } from "./imageLocationMarker";

export type NavigateToLocationInput = {
  location: string | null | undefined;
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
};

function parseLatLongPair(
  location: string
): { lat: number; long: number } | null {
  const [lat, long] = location.split(",").map(Number);
  if (isNaN(lat) || isNaN(long)) return null;
  return { lat, long };
}

function buildWgs84Point(lat: number, long: number): Point {
  return new Point({
    longitude: long,
    latitude: lat,
    spatialReference: { wkid: 4326 },
  });
}

export function navigateToLocation(input: NavigateToLocationInput) {
  const { location, mapView, redGraphicsLayer } = input;
  if (!location || !mapView) return;

  try {
    const coords = parseLatLongPair(location);
    if (!coords) return;

    const point = buildWgs84Point(coords.lat, coords.long);
    mapView.goTo({ target: point, zoom: 15 });
    if (redGraphicsLayer) replaceImageLocationMarker(redGraphicsLayer, point);
  } catch (error) {
    console.error("Error parsing location:", error);
  }
}
