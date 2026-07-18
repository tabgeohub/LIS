import type { FlightPlanPayloadFields } from "./usePopulateFlightPlanFormEffect";
export { pickFlightPlanFormValues } from "hooks/zustand/shared/flightPlanFormFields";
import {
  pickFlightPlanFormValues,
  type FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";

/** Pick create-payload form fields from a wizard zustand slice. */
export function pickFlightPlanCreateFields(
  store: FlightPlanFormFieldValues & { vluchtnummer?: string }
): FlightPlanPayloadFields {
  return {
    vluchtnummer: store.vluchtnummer,
    ...pickFlightPlanFormValues(store),
  };
}
