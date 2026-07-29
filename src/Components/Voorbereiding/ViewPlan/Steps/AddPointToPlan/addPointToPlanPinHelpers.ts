import { EnrichedPointType } from "Types";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

export type PinEntry = {
  outerGraphic: __esri.Graphic;
  pinGraphic: __esri.Graphic;
};

export function syncAddPointToPlanPins(input: {
  selectedPointIds: number[];
  dbPoints: EnrichedPointType[];
  mapView: __esri.MapView | null | undefined;
  pinRefs: Map<number, PinEntry>;
}) {
  if (!validateMapView(input.mapView)) return;

  const currentIds = new Set(input.selectedPointIds);
  input.pinRefs.forEach((value, key) => {
    if (!currentIds.has(key)) {
      input.mapView?.graphics.removeMany([value.outerGraphic, value.pinGraphic]);
      input.pinRefs.delete(key);
    }
  });

  input.dbPoints.forEach((pt) => {
    if (!currentIds.has(pt.id) || input.pinRefs.has(pt.id)) return;
    input.pinRefs.set(
      pt.id,
      createPin({
        point: pt as EnrichedPointType,
        mapView: input.mapView as __esri.MapView,
        label: pt.omschrijving,
      })
    );
  });
}

export function clearAddPointToPlanPins(input: {
  mapView: __esri.MapView | null | undefined;
  pinRefs: Map<number, PinEntry>;
}) {
  if (!input.mapView) return;
  const snapshot = new Map(input.pinRefs);
  snapshot.forEach(({ outerGraphic, pinGraphic }) => {
    input.mapView!.graphics.removeMany([outerGraphic, pinGraphic]);
  });
  input.pinRefs.clear();
}
