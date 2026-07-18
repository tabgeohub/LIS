import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

/** Shared map/plan context for point-coordinate update success + submit. */
export type PointCoordinateUpdateContext = {
  selectedPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType;
  setSelectedPoint: (point: FinishedPointType | null) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType | null) => void;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  setAction: (value: string) => void;
};

export function pickPointCoordinateUpdateContext(
  input: PointCoordinateUpdateContext
): PointCoordinateUpdateContext {
  return {
    selectedPoint: input.selectedPoint,
    selectedPlan: input.selectedPlan,
    setSelectedPoint: input.setSelectedPoint,
    setSelectedPlan: input.setSelectedPlan,
    mapView: input.mapView,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    yellowGraphicsLayer: input.yellowGraphicsLayer,
    redGraphicsLayer: input.redGraphicsLayer,
    setAction: input.setAction,
  };
}
