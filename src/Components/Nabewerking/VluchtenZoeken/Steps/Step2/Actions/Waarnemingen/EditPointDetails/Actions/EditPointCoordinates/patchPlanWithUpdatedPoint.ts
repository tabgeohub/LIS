import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { updateSavedGraphics } from "./pointMapGraphics";

export function patchPlanWithUpdatedPoint(input: {
  plan: FinishedFlightPlanType;
  selectedPoint: FinishedPointType;
  finalCoords: {
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  };
}) {
  const updatedPoint = { ...input.selectedPoint, ...input.finalCoords };
  return {
    updatedPoint,
    updatedPlan: {
      ...input.plan,
      points_data: [
        ...input.plan.points_data.filter((p) => p.id !== input.selectedPoint.id),
        updatedPoint,
      ],
    } as FinishedFlightPlanType,
  };
}

export function maybeUpdateSavedGraphics(input: {
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
}) {
  if (
    !input.mapView ||
    !input.pointsGraphicsLayer ||
    !input.yellowGraphicsLayer ||
    !input.redGraphicsLayer
  )
    return;
  updateSavedGraphics({
    mapView: input.mapView,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    yellowGraphicsLayer: input.yellowGraphicsLayer,
    redGraphicsLayer: input.redGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
  });
}
