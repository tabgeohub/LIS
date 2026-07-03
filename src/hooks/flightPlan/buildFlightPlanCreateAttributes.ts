import {
  buildFlightPlanPayloadFields,
  FlightPlanPayloadFields,
} from "./usePopulateFlightPlanFormEffect";

export type BuildFlightPlanCreateAttributesInput = {
  fields: FlightPlanPayloadFields;
  points: number[];
  basemap: string;
  layers: string;
  userId: number | undefined;
  regioId: string;
  status?: string;
  copiedFrom?: number;
};

/** Shared create payload for flight-plan wizards (Step3, template, reuse, duplicate). */
export function buildFlightPlanCreateAttributes(
  input: BuildFlightPlanCreateAttributesInput
) {
  const {
    fields,
    points,
    basemap,
    layers,
    userId,
    regioId,
    status = "pre-prepared",
    copiedFrom,
  } = input;

  return {
    vluchtnummer: fields.vluchtnummer,
    ...buildFlightPlanPayloadFields(fields),
    points,
    basemap,
    layers,
    user_id: userId,
    status,
    regio_id: regioId,
    ...(copiedFrom !== undefined ? { copiedFrom } : {}),
  };
}
