/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import {
  removeOwnedBluePointGraphics,
  syncBluePointGraphics,
} from "hooks/map/syncBluePointGraphics";
import type { PointData } from "@helpers/ArcGISHelpers/createPointGraphic";

export function useStepContentMapSync(displayedPoints: PointData[]) {
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    blueGraphicsRef.current = syncBluePointGraphics({
      points: displayedPoints,
      mapView,
      pointsGraphicsLayer,
      ownedGraphics: blueGraphicsRef.current,
    });
  }, [displayedPoints, mapView, pointsGraphicsLayer]);

  useEffect(() => {
    return () => {
      pointsGraphicsLayer?.removeAll();
      blueGraphicsRef.current = removeOwnedBluePointGraphics(
        mapView,
        blueGraphicsRef.current
      );
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer]);
}
