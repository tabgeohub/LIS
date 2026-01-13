/* eslint-disable react-hooks/exhaustive-deps */
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect } from "react";
import { EnrichedPointType } from "Types";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { FinishedPointType } from "Types/finished_plans";

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
    if (!mapView || !yellowGraphicsLayer) return;

    yellowGraphicsLayer.graphics.removeAll();

    if (!selectedPointIds || selectedPointIds.length === 0) {
      onPointsDrawn?.([]);
      return;
    }

    selectedPointIds.forEach((pointId) => {
      const point = points.find((p) => p.id === pointId);
      if (!point) return;

      let longitude: number | undefined = point.longitude;
      let latitude: number | undefined = point.latitude;

      if (
        (typeof longitude !== "number" || typeof latitude !== "number") &&
        typeof point.xcoordinaat_rd === "number" &&
        typeof point.ycoordinaat_rd === "number"
      ) {
        const wgs = getTransformedCoordinates(
          "RD",
          "WGS84",
          point.xcoordinaat_rd,
          point.ycoordinaat_rd
        );
        longitude = wgs.x;
        latitude = wgs.y;
      }

      if (typeof longitude !== "number" || typeof latitude !== "number") {
        return;
      }

      const yellow = new SimpleMarkerSymbol({
        color: "yellow",
        size: 12,
        style: "circle",
        outline: {
          color: "white",
          width: 1,
        },
      });

      const geometry = new Point({
        longitude,
        latitude,
        spatialReference: { wkid: 4326 },
      });

      const graphic = new Graphic({
        geometry,
        symbol: yellow,
        attributes: point,
      });

      yellowGraphicsLayer.add(graphic);
    });

    onPointsDrawn?.(selectedPointIds);
  }, [selectedPointIds, points, mapView, yellowGraphicsLayer, onPointsDrawn]);
}
