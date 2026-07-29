import { useEffect } from "react";
import Graphic from "@arcgis/core/Graphic";
import { createGeometryGraphic } from "Components/HomePage/helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "Components/HomePage/helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "Components/HomePage/helpers/ArcGISHelpers/replaceGraphics";
import type { Geometry } from "hooks/features/useGeometriesStore";

export function useGeometryListGraphics(input: {
  mapView: __esri.MapView | null;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null;
  geometries: Geometry[];
  selectedGeometryIds: number[];
}) {
  useEffect(() => {
    if (!validateMapView(input.mapView, input.geometriesGraphicsLayer)) return;

    if (!input.geometries.length) {
      input.geometriesGraphicsLayer?.removeAll();
      return;
    }

    const graphics = input.geometries
      .filter((geometry) => !input.selectedGeometryIds.includes(geometry.id))
      .map((geometry) => createGeometryGraphic(geometry))
      .filter((graphic): graphic is Graphic => graphic !== null);

    replaceGraphics(input.geometriesGraphicsLayer!, graphics);
  }, [
    input.geometries,
    input.selectedGeometryIds,
    input.mapView,
    input.geometriesGraphicsLayer,
  ]);
}
