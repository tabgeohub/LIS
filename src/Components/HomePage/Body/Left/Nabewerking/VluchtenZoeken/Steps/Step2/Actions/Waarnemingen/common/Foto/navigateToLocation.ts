import Point from "@arcgis/core/geometry/Point";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { replaceImageLocationMarker } from "./imageLocationMarker";

export type NavigateToLocationInput = {
  location: string | null | undefined;
  mapView: MapView | null | undefined;
  redGraphicsLayer: GraphicsLayer | null | undefined;
};

export function navigateToLocation(input: NavigateToLocationInput) {
  const { location, mapView, redGraphicsLayer } = input;
  if (!location || !mapView) return;

  try {
    const [lat, long] = location.split(",").map(Number);
    if (isNaN(lat) || isNaN(long)) return;

    const point = new Point({
      longitude: long,
      latitude: lat,
      spatialReference: { wkid: 4326 },
    });
    mapView.goTo({ target: point, zoom: 15 });
    if (redGraphicsLayer) replaceImageLocationMarker(redGraphicsLayer, point);
  } catch (error) {
    console.error("Error parsing location:", error);
  }
}
