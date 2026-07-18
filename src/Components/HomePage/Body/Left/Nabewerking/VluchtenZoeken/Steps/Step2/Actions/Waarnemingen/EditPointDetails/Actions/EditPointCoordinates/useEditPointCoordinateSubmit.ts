import useLogAction from "hooks/useLogAction";
import { useUpdateData } from "utils/useUpdateData";
import type { FinishedFlightPlanType, FinishedPointType } from "Types/finished_plans";
import type { EditPointCoordinateValues } from "./useEditPointCoordinateInputs";
import { submitPointCoordinateUpdate } from "./submitPointCoordinates";

export function useEditPointCoordinateSubmit(input: {
  setAction: (value: string) => void;
  selectedPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  setSelectedPoint: (value: FinishedPointType | null) => void;
  setSelectedPlan: (value: FinishedFlightPlanType | null) => void;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  values: EditPointCoordinateValues;
}) {
  const logAction = useLogAction();
  const { update, loading } = useUpdateData(
    `/points/${input.selectedPoint?.id}`
  );

  function handleSubmit() {
    if (!input.selectedPoint) return;
    submitPointCoordinateUpdate({
      selectedPoint: input.selectedPoint,
      selectedPlan: input.selectedPlan,
      setSelectedPoint: input.setSelectedPoint,
      setSelectedPlan: input.setSelectedPlan,
      mapView: input.mapView,
      pointsGraphicsLayer: input.pointsGraphicsLayer,
      yellowGraphicsLayer: input.yellowGraphicsLayer,
      redGraphicsLayer: input.redGraphicsLayer,
      setAction: input.setAction,
      coordinateSystem: input.values.coordinateSystem,
      longitude: input.values.longitude,
      latitude: input.values.latitude,
      xcoordinaat_rd: input.values.xcoordinaat_rd,
      ycoordinaat_rd: input.values.ycoordinaat_rd,
      update,
      logAction,
    });
  }

  return { loading, handleSubmit };
}
