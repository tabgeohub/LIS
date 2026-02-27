/* eslint-disable react-hooks/exhaustive-deps */
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect } from "react";
import { EnrichedPointType } from "Types";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { FinishedPointType } from "Types/finished_plans";
import { YELLOW_MARKER_SYMBOL } from "@helpers/ArcGISHelpers/createSymbols";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

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
    if (!validateMapView(mapView, yellowGraphicsLayer)) return;

    yellowGraphicsLayer.graphics.removeAll();

    if (!selectedPointIds || selectedPointIds.length === 0) {
      onPointsDrawn?.([]);
      return;
    }

    selectedPointIds.forEach((pointId) => {
      const point = points.find((p) => p.id === pointId);
      if (!point) return;

      const coords = getPointCoordinates(point);
      if (!coords) return;

      const geometry = new Point({
        longitude: coords.longitude,
        latitude: coords.latitude,
        spatialReference: { wkid: 4326 },
      });

      const graphic = new Graphic({
        geometry,
        symbol: YELLOW_MARKER_SYMBOL,
        attributes: point,
      });

      yellowGraphicsLayer.add(graphic);
    });

    onPointsDrawn?.(selectedPointIds);
  }, [selectedPointIds, points, mapView, yellowGraphicsLayer, onPointsDrawn]);
}
