import { emptyFlightPlanFormFields } from "./flightPlanFormDefaults";
import type { FlightPlanFormFieldValues } from "./flightPlanFormTypes";

const flightPlanFormFieldKeys = Object.keys(
  emptyFlightPlanFormFields
) as (keyof FlightPlanFormFieldValues)[];

export function pickFlightPlanFormValues(
  source: FlightPlanFormFieldValues
): FlightPlanFormFieldValues {
  return Object.fromEntries(
    flightPlanFormFieldKeys.map((field) => [field, source[field]])
  ) as FlightPlanFormFieldValues;
}
