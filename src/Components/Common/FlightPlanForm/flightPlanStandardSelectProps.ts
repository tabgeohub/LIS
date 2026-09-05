import {
  defaultFlightPlanFieldLabels,
  type FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import { useFlightPlanFormSelectOptions } from "./useFlightPlanFormSelectOptions";

export type FlightPlanFieldLabels = {
  [K in keyof FlightPlanFormFieldValues]: string;
};

type SelectOption = { label: string; value: string };

/** Shared select-option + label props for FlightPlanStandardFields forms. */
export function flightPlanStandardSelectProps(options: {
  pilootOptions: SelectOption[];
  waarnemerOptions: SelectOption[];
  typeLuchtvaartuigOptions: SelectOption[];
}) {
  return {
    labels: defaultFlightPlanFieldLabels,
    ...options,
  };
}

/** Shared FlightPlanStandardFields select props for duplicate / reuse / view forms. */
export function useFlightPlanStandardSelectProps(overrides?: {
  typeLuchtvaartuigOptions?: SelectOption[];
}) {
  const options = useFlightPlanFormSelectOptions();
  return flightPlanStandardSelectProps({
    pilootOptions: options.pilootOptions,
    waarnemerOptions: options.waarnemerOptions,
    typeLuchtvaartuigOptions:
      overrides?.typeLuchtvaartuigOptions ?? options.typeLuchtvaartuigOptions,
  });
}
