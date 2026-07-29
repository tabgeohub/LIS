import useLogAction from "hooks/useLogAction";
import { useUpdateData } from "api-hooks/mutations";
import type { EditPointCoordinateValues } from "./useEditPointCoordinateInputs";
import { submitPointCoordinateUpdate } from "./submitPointCoordinates";
import {
  pickPointCoordinateUpdateContext,
  type PointCoordinateUpdateSubmitContext,
} from "./pointCoordinateUpdateContext";

type EditPointCoordinateSubmitInput = Omit<
  PointCoordinateUpdateSubmitContext,
  "selectedPoint" | "selectedPlan"
> & {
  selectedPoint: PointCoordinateUpdateSubmitContext["selectedPoint"] | null;
  selectedPlan: PointCoordinateUpdateSubmitContext["selectedPlan"];
  values: EditPointCoordinateValues;
};

export function useEditPointCoordinateSubmit(
  input: EditPointCoordinateSubmitInput
) {
  const logAction = useLogAction();
  const { update, loading } = useUpdateData(
    `/points/${input.selectedPoint?.id}`
  );

  function handleSubmit() {
    if (!input.selectedPoint) return;
    submitPointCoordinateUpdate({
      ...pickPointCoordinateUpdateContext({
        ...input,
        selectedPoint: input.selectedPoint,
        selectedPlan: input.selectedPlan,
      }),
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
