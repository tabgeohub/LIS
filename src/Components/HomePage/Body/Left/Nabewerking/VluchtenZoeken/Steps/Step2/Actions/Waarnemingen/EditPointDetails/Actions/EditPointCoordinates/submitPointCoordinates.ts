import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import type { UpdateInput } from "utils/useUpdateData";
import { applyPointCoordinateUpdateSuccess } from "./applyPointCoordinateUpdateSuccess";
import { buildPointCoordinatePayload } from "./buildPointCoordinatePayload";
import {
  pickPointCoordinateUpdateContext,
  type PointCoordinateUpdateContext,
} from "./pointCoordinateUpdateContext";

type SubmitPointCoordinatesInput = Omit<
  PointCoordinateUpdateContext,
  "selectedPlan"
> & {
  selectedPlan: FinishedFlightPlanType | null;
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  update: (input: UpdateInput<unknown>) => Promise<void>;
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
        ...pickPointCoordinateUpdateContext({
          ...input,
          selectedPlan: input.selectedPlan,
        }),
        finalCoords,
      });
    },
  });

  input.logAction({
    message: "User updated point coordinates",
    step: "Second step - Edit point coordinates",
    newData: { coordinateSystem: input.coordinateSystem, ...finalCoords },
  });
}

export type { FinishedFlightPlanType, FinishedPointType };
