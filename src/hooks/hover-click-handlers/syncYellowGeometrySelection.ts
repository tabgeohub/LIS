import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { buildSelectedGeometryGraphics } from "@helpers/ArcGISHelpers/selectedGeometryGraphics";
import { ClickableGeometry } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";

export function syncYellowGeometrySelection(input: {
  mapView: __esri.MapView | null | undefined;
  yellowGeometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  allGeometries: ClickableGeometry[];
  selectedGeometryIds: number[];
}) {
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
