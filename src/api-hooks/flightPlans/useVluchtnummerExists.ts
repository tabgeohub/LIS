import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "lib/useDebouncedValue";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";
import { vluchtnummerExistsQuery } from "./flightPlanLookupQueryDefs";

export function useVluchtnummerExists(vluchtnummer: string, enabled = true) {
  const debounced = useDebouncedValue(vluchtnummer, FLIGHT_PLAN_DEBOUNCE_MS);
  return useQuery(vluchtnummerExistsQuery(debounced, enabled));
}
