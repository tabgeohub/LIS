import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export function navigateToLocation(
  location: string | null | undefined,
  mapView: MapView | null | undefined,
  redGraphicsLayer: GraphicsLayer | null | undefined
) {
  if (!location || !mapView) return;

  try {
    const [lat, long] = location.split(",").map(Number);
    if (isNaN(lat) || isNaN(long)) return;

    const point = new Point({
      longitude: long,
      latitude: lat,
      spatialReference: { wkid: 4326 },
    });

    mapView.goTo({
      target: point,
      zoom: 15,
    });

    if (redGraphicsLayer) {
      const graphics = redGraphicsLayer.graphics.toArray();
      graphics
        .filter((g) => g.attributes?.type === "image-location-marker")
        .forEach((g) => redGraphicsLayer.remove(g));

      const markerSymbol = new SimpleMarkerSymbol({
        color: [255, 0, 0, 0.8],
        size: 16,
        style: "circle",
        outline: {
          color: [255, 255, 255, 1],
          width: 2,
        },
      });

      const markerGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: { type: "image-location-marker" },
      });

      redGraphicsLayer.add(markerGraphic);

      setTimeout(() => {
        redGraphicsLayer.remove(markerGraphic);
      }, 5000);
    }
  } catch (error) {
    console.error("Error parsing location:", error);
  }
}
