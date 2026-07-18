import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import type { UpdateInput } from "utils/useUpdateData";
import { applyPointCoordinateUpdateSuccess } from "./applyPointCoordinateUpdateSuccess";
import { buildPointCoordinatePayload } from "./buildPointCoordinatePayload";

type SubmitPointCoordinatesInput = {
  selectedPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType | null;
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  update: (input: UpdateInput<unknown>) => Promise<void>;
  setSelectedPoint: (point: FinishedPointType) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  setAction: (value: string) => void;
  logAction: (entry: {
    message: string;
    step: string;
    newData: Record<string, unknown>;
  }) => void;
};

export function submitPointCoordinateUpdate(input: SubmitPointCoordinatesInput) {
  const { finalCoords, payload } = buildPointCoordinatePayload(
    input.selectedPoint,
    input.coordinateSystem,
    {
      longitude: input.longitude,
      latitude: input.latitude,
      xcoordinaat_rd: input.xcoordinaat_rd,
      ycoordinaat_rd: input.ycoordinaat_rd,
    }
  );

  input.update({
    data: payload,
    onSuccess: (responseData) => {
      if (!responseData.result || !input.selectedPlan) return;
      applyPointCoordinateUpdateSuccess({
        selectedPoint: input.selectedPoint,
        selectedPlan: input.selectedPlan,
        finalCoords,
        setSelectedPoint: input.setSelectedPoint,
        setSelectedPlan: input.setSelectedPlan,
        mapView: input.mapView,
        pointsGraphicsLayer: input.pointsGraphicsLayer,
        yellowGraphicsLayer: input.yellowGraphicsLayer,
        redGraphicsLayer: input.redGraphicsLayer,
        setAction: input.setAction,
      });
    },
  });

  input.logAction({
    message: "User updated point coordinates",
    step: "Second step - Edit point coordinates",
    newData: { coordinateSystem: input.coordinateSystem, ...finalCoords },
  });
}
