import type { MutableRefObject } from "react";
import type { FinishedPointType } from "Types/finished_plans";
import {
  useEditPointCleanup,
  useEditPointMapClick,
  useEditPointPreviewGraphics,
} from "./useEditPointMapEffects";
import { useInitialEditPointMarker } from "./useEditPointCoordinateInputs";

export function useEditPointCoordinateEffects(input: {
  selectedPoint: FinishedPointType | null;
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
  originalCoordsRef: MutableRefObject<{
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  } | null>;
}) {
  useInitialEditPointMarker({
    selectedPoint: input.selectedPoint,
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
  });

  const clickHandleRef = useEditPointMapClick({
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    coordinateSystem: input.coordinateSystem,
    setLongitude: input.setLongitude,
    setLatitude: input.setLatitude,
    setXCoordinaat_rd: input.setXCoordinaat_rd,
    setYCoordinaat_rd: input.setYCoordinaat_rd,
  });

  useEditPointPreviewGraphics({
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    selectedPoint: input.selectedPoint,
    longitude: input.longitude,
    latitude: input.latitude,
  });

  useEditPointCleanup({
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    selectedPoint: input.selectedPoint,
    originalCoordsRef: input.originalCoordsRef,
    clickHandleRef,
  });
}
