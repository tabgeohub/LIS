import {
  applyFlightPlanFormValues,
  FlightPlanFormFieldSetters,
} from "hooks/zustand/shared/flightPlanFormFields";
import type { FlightPlanFormFieldValues } from "hooks/zustand/shared/flightPlanFormTypes";
import type { FlightPlanPersistenceFields } from "Types";

export type FlightPlanFormSource = Partial<FlightPlanPersistenceFields>;

type StringFormKey = Exclude<
  keyof FlightPlanFormFieldValues,
  "aantalPassagiers"
>;

const PLAN_TO_FORM_STRING_FIELDS: ReadonlyArray<{
  planKey: keyof FlightPlanPersistenceFields;
  formKey: StringFormKey;
}> = [
  { planKey: "omschrijving", formKey: "omschrijving" },
  { planKey: "waarnemer", formKey: "waarnemer" },
  { planKey: "piloot", formKey: "piloot" },
  { planKey: "datum", formKey: "datum" },
  { planKey: "vliegduur", formKey: "geplandeVliegduur" },
  { planKey: "luchtvaartuig", formKey: "typeLuchtvaartuig" },
  { planKey: "hoofdthema", formKey: "doelEnHoofdthema" },
  { planKey: "aanvullende", formKey: "aanvullendeInfo" },
];

function coalesceFormString(value: unknown): string {
  return (value as string | undefined) ?? "";
}

function buildFormValuesFromPlan(
  plan: FlightPlanFormSource
): FlightPlanFormFieldValues {
  const values = {} as FlightPlanFormFieldValues;
  for (const { planKey, formKey } of PLAN_TO_FORM_STRING_FIELDS) {
    values[formKey] = coalesceFormString(plan[planKey]);
  }
  values.aantalPassagiers = plan.passagiers ?? null;
  return values;
}

export function populateFormFromPlan(
  plan: FlightPlanFormSource,
  setters: FlightPlanFormFieldSetters
): void {
  applyFlightPlanFormValues(setters, buildFormValuesFromPlan(plan));
}
