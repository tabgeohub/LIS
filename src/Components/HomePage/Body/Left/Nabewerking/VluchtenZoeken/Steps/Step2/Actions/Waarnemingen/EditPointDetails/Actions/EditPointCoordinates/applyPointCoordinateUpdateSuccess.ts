import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import {
  maybeUpdateSavedGraphics,
  patchPlanWithUpdatedPoint,
} from "./patchPlanWithUpdatedPoint";

export function applyPointCoordinateUpdateSuccess(input: {
  selectedPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType;
  finalCoords: {
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  };
  setSelectedPoint: (point: FinishedPointType) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  setAction: (value: string) => void;
}) {
  const { updatedPoint, updatedPlan } = patchPlanWithUpdatedPoint(
    input.selectedPlan,
    input.selectedPoint,
    input.finalCoords
  );
  input.setSelectedPoint(updatedPoint);
  input.setSelectedPlan(updatedPlan);
  maybeUpdateSavedGraphics({
    mapView: input.mapView,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    yellowGraphicsLayer: input.yellowGraphicsLayer,
    redGraphicsLayer: input.redGraphicsLayer,
    point: updatedPoint,
    longitude: input.finalCoords.longitude,
    latitude: input.finalCoords.latitude,
  });
  input.setAction("form");
}
