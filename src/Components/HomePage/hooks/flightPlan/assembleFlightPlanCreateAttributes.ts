import { buildFlightPlanCreateAttributes } from "./buildFlightPlanCreateAttributes";
import { pickFlightPlanCreateFields } from "./pickFlightPlanCreateFields";
import type { FlightPlanFormFieldValues } from "hooks/zustand/shared/flightPlanFormFields";

export type AssembleFlightPlanCreateAttributesInput = {
  store: FlightPlanFormFieldValues & { vluchtnummer?: string };
  points: number[];
  basemap: string;
  layers: string[] | string;
  userId: number | undefined;
  regioId: string;
  status?: string;
  copiedFrom?: number;
};

/** Pick form fields + build create payload (shared by wizards). */
export function assembleFlightPlanCreateAttributes(
  input: AssembleFlightPlanCreateAttributesInput
) {
  return buildFlightPlanCreateAttributes({
    fields: pickFlightPlanCreateFields(input.store),
    points: input.points,
    basemap: input.basemap,
    layers: Array.isArray(input.layers)
      ? input.layers.join(",")
      : input.layers,
    userId: input.userId,
    regioId: input.regioId,
    status: input.status,
    copiedFrom: input.copiedFrom,
  });
}
