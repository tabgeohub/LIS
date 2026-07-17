/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect } from "react";
import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { syncYellowMarkerSelection } from "./syncYellowMarkerSelection";

type PointType = EnrichedPointType | FinishedPointType;

interface UseDrawYellowMarkersOptions {
  selectedPointIds: number[];
  points: PointType[];
  onPointsDrawn?: (selectedPoints: number[]) => void;
}

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
