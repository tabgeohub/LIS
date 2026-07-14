/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect } from "react";
import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { buildYellowMarkerGraphics } from "./yellowMarkerGraphics";

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
    if (!validateMapView(mapView, yellowGraphicsLayer) || !yellowGraphicsLayer) return;

    yellowGraphicsLayer.graphics.removeAll();

    if (!selectedPointIds || selectedPointIds.length === 0) {
      onPointsDrawn?.([]);
      return;
    }

    yellowGraphicsLayer.addMany(buildYellowMarkerGraphics(points, selectedPointIds));

    onPointsDrawn?.(selectedPointIds);
  }, [selectedPointIds, points, mapView, yellowGraphicsLayer, onPointsDrawn]);
}
