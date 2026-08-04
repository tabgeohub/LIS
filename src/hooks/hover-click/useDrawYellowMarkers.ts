/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "hooks/zustand/ui";
import { useEffect } from "react";
import {
  syncYellowMarkerSelection,
  type UseDrawYellowMarkersOptions,
} from "./syncYellowMarkerSelection";

export default function useDrawYellowMarkers({
  selectedPointIds,
  points,
  onPointsDrawn,
}: UseDrawYellowMarkersOptions) {
  const { mapView, yellowGraphicsLayer } = useMapViewState();

  useEffect(() => {
    syncYellowMarkerSelection({
      mapView,
      yellowGraphicsLayer,
      selectedPointIds,
      points,
      onPointsDrawn,
    });
  }, [selectedPointIds, points, mapView, yellowGraphicsLayer, onPointsDrawn]);
}
