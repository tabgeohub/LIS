import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";

type PointCoordinateUpdateContextBase = {
  selectedPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPoint: (point: FinishedPointType | null) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType | null) => void;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  setAction: (value: string) => void;
};

/** Shared map/plan context for point-coordinate update submit wiring. */
export type PointCoordinateUpdateSubmitContext =
  PointCoordinateUpdateContextBase;

/** Shared map/plan context for point-coordinate update success handling. */
export type PointCoordinateUpdateContext = Omit<
  PointCoordinateUpdateContextBase,
  "selectedPlan"
> & {
  selectedPlan: FinishedFlightPlanType;
};

export function pickPointCoordinateUpdateContext(
  input: PointCoordinateUpdateSubmitContext
): PointCoordinateUpdateSubmitContext {
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
