import Map from "@arcgis/core/Map";
import Extent from "@arcgis/core/geometry/Extent";
import Polygon from "@arcgis/core/geometry/Polygon";
import MapView from "@arcgis/core/views/MapView";

export function createConfiguredMapView(input: {
  container: HTMLDivElement | null;
  map: Map;
  extent: Extent;
  polygon: Polygon;
}) {
  const mapView = new MapView({
    container: input.container,
    map: input.map,
    extent: input.extent.toJSON(),
    constraints: {
      geometry: input.polygon,
      minZoom: 6,
      maxZoom: 18,
      rotationEnabled: false,
      // @ts-expect-error: available on supported 4.x versions
      wrapAroundEnabled: false,
    },
    navigation: { momentumEnabled: false },
  });

  const compatibleView = mapView as MapView & {
    clippingArea?: Polygon;
    clipToGeometryEnabled?: boolean;
  };
  if ("clippingArea" in compatibleView) {
    compatibleView.clippingArea = input.polygon;
    if ("clipToGeometryEnabled" in compatibleView) {
      compatibleView.clipToGeometryEnabled = true;
    }
  }
  return mapView;
}
