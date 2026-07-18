import { flightPlanStandardSelectProps } from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanFormSelectOptions } from "./useFlightPlanFormSelectOptions";

type SelectOption = { label: string; value: string };

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
