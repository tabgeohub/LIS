import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import { updateSavedGraphics } from "./pointMapGraphics";

export function patchPlanWithUpdatedPoint(
  plan: FinishedFlightPlanType,
  selectedPoint: FinishedPointType,
  finalCoords: {
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  }
) {
  const updatedPoint = { ...selectedPoint, ...finalCoords };
  return {
    updatedPoint,
    updatedPlan: {
      ...plan,
      points_data: [
        ...plan.points_data.filter((p) => p.id !== selectedPoint.id),
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
