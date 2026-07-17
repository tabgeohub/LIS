/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { ClickableGeometry } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { syncYellowGeometrySelection } from "./syncYellowGeometrySelection";

interface UseDrawYellowGeometriesOptions {
  selectedGeometryIds: number[];
  geometries: ClickableGeometry[];
  allGeometries: ClickableGeometry[];
  herhalenFilter?: boolean | null;
}

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
