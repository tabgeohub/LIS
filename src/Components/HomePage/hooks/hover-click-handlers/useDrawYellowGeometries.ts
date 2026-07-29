/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import {
  syncYellowGeometrySelection,
  type UseDrawYellowGeometriesOptions,
} from "./syncYellowGeometrySelection";

export default function useDrawYellowGeometries({
  selectedGeometryIds,
  allGeometries,
}: UseDrawYellowGeometriesOptions) {
  const { mapView, yellowGeometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    syncYellowGeometrySelection({
      mapView,
      yellowGeometriesGraphicsLayer,
      allGeometries,
      selectedGeometryIds,
    });
  }, [selectedGeometryIds, allGeometries, mapView, yellowGeometriesGraphicsLayer]);
}
