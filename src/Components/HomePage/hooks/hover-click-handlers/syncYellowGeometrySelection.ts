import { validateMapView } from "Components/HomePage/helpers/ArcGISHelpers/validateMapView";
import { buildSelectedGeometryGraphics } from "Components/HomePage/helpers/ArcGISHelpers/selectedGeometryGraphics";
import { ClickableGeometry } from "Components/HomePage/helpers/ArcGISHelpers/createGeometryMapGraphics";

export type SyncYellowGeometrySelectionInput = {
  mapView: __esri.MapView | null | undefined;
  yellowGeometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  allGeometries: ClickableGeometry[];
  selectedGeometryIds: number[];
};

/** Public hook options; unused fields kept for call-site compatibility. */
export type UseDrawYellowGeometriesOptions = {
  selectedGeometryIds: number[];
  geometries: ClickableGeometry[];
  allGeometries: ClickableGeometry[];
  herhalenFilter?: boolean | null;
};

export function syncYellowGeometrySelection(
  input: SyncYellowGeometrySelectionInput
) {
  if (!validateMapView(input.mapView, input.yellowGeometriesGraphicsLayer)) {
    return;
  }

  const layer = input.yellowGeometriesGraphicsLayer!;
  layer.graphics.removeAll();
  layer.addMany(
    buildSelectedGeometryGraphics(
      input.allGeometries,
      input.selectedGeometryIds ?? []
    )
  );
}
