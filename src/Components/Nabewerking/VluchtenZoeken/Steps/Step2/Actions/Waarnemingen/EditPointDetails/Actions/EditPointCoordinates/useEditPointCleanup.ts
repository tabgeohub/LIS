import { MutableRefObject, useEffect } from "react";
import type { FinishedPointType } from "Types/finished_plans";
import { restoreOriginalPointGraphic } from "./pointMapGraphics";

type EditPointCleanupInput = {
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
};

function runEditPointCleanup(input: EditPointCleanupInput) {
  input.clickHandleRef.current?.remove();
  input.redGraphicsLayer?.removeAll();
  const original = input.originalCoordsRef.current;
  if (
    !original ||
    !input.mapView ||
    !input.pointsGraphicsLayer ||
    !input.selectedPoint
  )
    return;
  restoreOriginalPointGraphic({
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    point: input.selectedPoint,
    longitude: original.longitude,
    latitude: original.latitude,
  });
}

export function useEditPointCleanup(input: EditPointCleanupInput) {
  useEffect(() => () => runEditPointCleanup(input), [
    input.redGraphicsLayer,
    input.mapView,
    input.pointsGraphicsLayer,
    input.selectedPoint,
    input.originalCoordsRef,
    input.clickHandleRef,
  ]);
}
