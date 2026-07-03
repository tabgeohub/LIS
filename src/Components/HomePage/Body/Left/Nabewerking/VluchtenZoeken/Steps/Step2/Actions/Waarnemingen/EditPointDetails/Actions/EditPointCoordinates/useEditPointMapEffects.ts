import { MutableRefObject, useEffect, useRef } from "react";
import useLogAction from "hooks/useLogAction";
import type { FinishedPointType } from "Types/finished_plans";
import { coordsFromMapClick } from "./coordinateFinalize";
import {
  restoreOriginalPointGraphic,
  showRedMarkerAt,
  updatePreviewGraphics,
} from "./pointMapGraphics";

export function useEditPointMapClick(input: {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  coordinateSystem: string;
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoordinaat_rd: (value: number) => void;
  setYCoordinaat_rd: (value: number) => void;
}) {
  const logAction = useLogAction();
  const clickHandleRef = useRef<__esri.Handle | null>(null);

  useEffect(() => {
    const { mapView, redGraphicsLayer, coordinateSystem } = input;
    if (!mapView || !redGraphicsLayer) return;

    const clickHandle = mapView.on("click", (event) => {
      event.stopPropagation?.();
      if (!event.mapPoint?.longitude || !event.mapPoint?.latitude) return;

      const next = coordsFromMapClick(
        coordinateSystem,
        event.mapPoint.longitude,
        event.mapPoint.latitude
      );
      input.setLongitude(next.longitude);
      input.setLatitude(next.latitude);
      input.setXCoordinaat_rd(next.xcoordinaat_rd);
      input.setYCoordinaat_rd(next.ycoordinaat_rd);
      showRedMarkerAt(
        redGraphicsLayer,
        mapView,
        next.longitude,
        next.latitude
      );

      logAction({
        message: "User clicked on map to update point coordinates",
        step: "Second step - Edit point coordinates",
        newData: { longitude: next.longitude, latitude: next.latitude },
      });
    });

    clickHandleRef.current = clickHandle;
    return () => clickHandle.remove();
  }, [
    input.mapView,
    input.redGraphicsLayer,
    input.coordinateSystem,
    input.setLongitude,
    input.setLatitude,
    input.setXCoordinaat_rd,
    input.setYCoordinaat_rd,
    logAction,
  ]);

  return clickHandleRef;
}

export function useEditPointPreviewGraphics(input: {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  selectedPoint: FinishedPointType | null;
  longitude: number;
  latitude: number;
}) {
  useEffect(() => {
    const {
      mapView,
      redGraphicsLayer,
      pointsGraphicsLayer,
      selectedPoint,
      longitude,
      latitude,
    } = input;
    if (!mapView || !redGraphicsLayer || !pointsGraphicsLayer || !selectedPoint) {
      return;
    }
    if (!longitude || !latitude) return;

    const timeoutId = setTimeout(() => {
      updatePreviewGraphics({
        mapView,
        redGraphicsLayer,
        pointsGraphicsLayer,
        point: selectedPoint,
        longitude,
        latitude,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    input.longitude,
    input.latitude,
    input.mapView,
    input.redGraphicsLayer,
    input.pointsGraphicsLayer,
    input.selectedPoint,
  ]);
}

export function useEditPointCleanup(input: {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  selectedPoint: FinishedPointType | null;
  originalCoordsRef: MutableRefObject<{
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  } | null>;
  clickHandleRef: MutableRefObject<__esri.Handle | null>;
}) {
  useEffect(() => {
    return () => {
      input.clickHandleRef.current?.remove();
      input.redGraphicsLayer?.removeAll();

      const original = input.originalCoordsRef.current;
      if (
        !original ||
        !input.mapView ||
        !input.pointsGraphicsLayer ||
        !input.selectedPoint
      ) {
        return;
      }

      restoreOriginalPointGraphic({
        pointsGraphicsLayer: input.pointsGraphicsLayer,
        point: input.selectedPoint,
        longitude: original.longitude,
        latitude: original.latitude,
      });
    };
  }, [
    input.redGraphicsLayer,
    input.mapView,
    input.pointsGraphicsLayer,
    input.selectedPoint,
    input.originalCoordsRef,
    input.clickHandleRef,
  ]);
}
