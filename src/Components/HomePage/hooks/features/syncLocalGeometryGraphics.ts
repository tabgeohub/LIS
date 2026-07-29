import { Geometry } from "hooks/features/useGeometriesStore";
import { createGeometryGraphics } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";

/** Sync local geometry graphics onto the geometries layer; returns cleanup. */
export function syncLocalGeometryGraphics(input: {
  mapView: __esri.MapView | null | undefined;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  geometries: Geometry[];
}) {
  const { mapView, geometriesGraphicsLayer, geometries } = input;
  if (!validateMapView(mapView, geometriesGraphicsLayer) || !geometriesGraphicsLayer) {
    return;
  }

  if (!geometries.length) {
    geometriesGraphicsLayer.removeAll();
    return () => {
      geometriesGraphicsLayer.removeAll();
    };
  }

  replaceGraphics(
    geometriesGraphicsLayer,
    createGeometryGraphics(geometries, { attributes: {} })
  );

  return () => {
    geometriesGraphicsLayer.removeAll();
  };
}
