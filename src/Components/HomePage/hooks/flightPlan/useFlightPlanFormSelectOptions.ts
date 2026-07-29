import { useConstSelectOptions } from "Components/HomePage/hooks/consts/useConstSelectOptions";

export function useFlightPlanFormSelectOptions() {
  const pilootOptions = useConstSelectOptions("piloten");
  const waarnemerOptions = useConstSelectOptions("waarnemers");
  const typeLuchtvaartuigOptions = useConstSelectOptions("luchtvaartuig");

  return { pilootOptions, waarnemerOptions, typeLuchtvaartuigOptions };
}
