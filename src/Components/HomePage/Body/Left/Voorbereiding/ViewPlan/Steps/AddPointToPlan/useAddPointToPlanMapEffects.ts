/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { EnrichedPointType } from "Types";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useHoverPointsAndGeometries } from "Components/HomePage/hooks/features/useHoverPointsAndGeometries";
import { syncBluePointGraphics } from "@helpers/ArcGISHelpers/syncBluePointGraphics";
import {
  clearAddPointToPlanPins,
  syncAddPointToPlanPins,
  type PinEntry,
} from "./addPointToPlanPinHelpers";

export function useAddPointToPlanBluePoints(filteredPoints: EnrichedPointType[]) {
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    blueGraphicsRef.current = syncBluePointGraphics({
      points: filteredPoints,
      mapView,
      pointsGraphicsLayer,
      ownedGraphics: blueGraphicsRef.current,
    });
  }, [filteredPoints, mapView, pointsGraphicsLayer]);
}

export function useAddPointToPlanPins(
  selectedPointIds: number[],
  dbPoints: EnrichedPointType[]
) {
  const { mapView } = useMapViewState();
  const pinRefs = useRef<Map<number, PinEntry>>(new Map());

  useEffect(() => {
    syncAddPointToPlanPins({
      selectedPointIds,
      dbPoints,
      mapView,
      pinRefs: pinRefs.current,
    });
  }, [selectedPointIds, mapView, dbPoints]);

  useHoverPointsAndGeometries({ pinRefs });

  useEffect(() => {
    return () => clearAddPointToPlanPins({ mapView, pinRefs: pinRefs.current });
  }, [mapView]);

  return pinRefs;
}
