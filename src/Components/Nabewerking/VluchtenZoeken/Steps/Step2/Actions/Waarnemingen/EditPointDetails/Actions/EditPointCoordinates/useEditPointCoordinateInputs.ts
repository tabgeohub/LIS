import { useEffect } from "react";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import type { FinishedPointType } from "Types/finished_plans";
import { showRedMarkerAt } from "./pointMapGraphics";
import { useEditPointCoordState } from "./useEditPointCoordState";
import {
  useSyncEditPointCoordinateSystem,
  useSyncEditPointFromSelection,
} from "./useEditPointCoordSyncEffects";

export type EditPointCoordinateValues = {
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
};

export function useEditPointCoordinateInputs(
  selectedPoint: FinishedPointType | null
) {
  const state = useEditPointCoordState();
  useSyncEditPointFromSelection(selectedPoint, state);
  useSyncEditPointCoordinateSystem(selectedPoint, state);
  return state;
}

export function useInitialEditPointMarker(input: {
  selectedPoint: FinishedPointType | null;
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
}) {
  useEffect(() => {
    const { selectedPoint, mapView, redGraphicsLayer } = input;
    if (!selectedPoint) return;
    if (
      validateMapView(mapView, redGraphicsLayer) &&
      selectedPoint.longitude &&
      selectedPoint.latitude
    ) {
      showRedMarkerAt({
        redGraphicsLayer: redGraphicsLayer!,
        mapView: mapView!,
        longitude: selectedPoint.longitude,
        latitude: selectedPoint.latitude,
      });
    }
  }, [input.selectedPoint, input.mapView, input.redGraphicsLayer]);
}
