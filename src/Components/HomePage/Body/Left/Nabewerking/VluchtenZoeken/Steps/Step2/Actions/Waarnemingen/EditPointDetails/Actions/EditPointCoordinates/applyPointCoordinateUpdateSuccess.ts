import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import {
  maybeUpdateSavedGraphics,
  patchPlanWithUpdatedPoint,
} from "./patchPlanWithUpdatedPoint";
import type { PointCoordinateUpdateContext } from "./pointCoordinateUpdateContext";

export function applyPointCoordinateUpdateSuccess(
  input: PointCoordinateUpdateContext & {
    finalCoords: {
      longitude: number;
      latitude: number;
      xcoordinaat_rd: number;
      ycoordinaat_rd: number;
    };
  }
) {
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

export type { FinishedFlightPlanType, FinishedPointType };
