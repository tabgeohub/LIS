import { assembleFlightPlanCreateAttributes } from "./assembleFlightPlanCreateAttributes";
import { collectUniquePlanPointIds } from "./collectUniquePlanPointIds";
import { runFlightPlanCreateSuccess } from "./runFlightPlanCreateSuccess";
import type { FlightPlanFormFieldValues } from "hooks/zustand/shared/flightPlanFormFields";

type GeometryWithPoints = {
  id: number;
  points?: { id?: number }[];
};

export type SubmitCollectedFlightPlanCreateInput = {
  create: (args: {
    data: ReturnType<typeof assembleFlightPlanCreateAttributes>;
    onSuccess: () => void;
  }) => void;
  store: FlightPlanFormFieldValues & { vluchtnummer?: string };
  pointIds: number[];
  geometryIds?: number[];
  geometries?: GeometryWithPoints[];
  basemap: string;
  layers: string[];
  userId: number | undefined;
  regioId: string;
  onCleanup?: () => void;
  beforeCreate?: (
    attributes: ReturnType<typeof assembleFlightPlanCreateAttributes>
  ) => void;
};

/** Collect point IDs, assemble attributes, create plan, run shared success UX. */
export function submitCollectedFlightPlanCreate(
  input: SubmitCollectedFlightPlanCreateInput
) {
  const points = collectUniquePlanPointIds({
    pointIds: input.pointIds,
    geometryIds: input.geometryIds,
    geometries: input.geometries,
  });

  const attributes = assembleFlightPlanCreateAttributes({
    store: input.store,
    points,
    basemap: input.basemap,
    layers: input.layers,
    userId: input.userId,
    regioId: input.regioId,
  });

  input.beforeCreate?.(attributes);

  input.create({
    data: attributes,
    onSuccess: () =>
      runFlightPlanCreateSuccess({
        onCleanup: input.onCleanup,
      }),
  });

  return attributes;
}
