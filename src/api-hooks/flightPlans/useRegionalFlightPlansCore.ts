import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api-hooks/fetchApi";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "../shared/regioQuery";
import {
  FLIGHT_PLAN_REGIO_CONFIG,
  type FlightPlanRegioKind,
  type FlightPlanRegioQueryInput,
} from "./regionalFlightPlanQueryConfig";

function isRegionalQueryEnabled(input: FlightPlanRegioQueryInput): boolean {
  const explicitlyEnabled = input.enabled ?? true;
  return explicitlyEnabled && enabledForRegio(input.regioId, input.userId);
}

/** Shared regio-scoped flight-plan query; not a public API surface. */
export function useRegionalFlightPlans(
  kind: FlightPlanRegioKind,
  input: FlightPlanRegioQueryInput
) {
  const config = FLIGHT_PLAN_REGIO_CONFIG[kind];
  return useQuery({
    queryKey: config.key(input.regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(appendRegioQuery(config.path, input.regioId)),
    enabled: isRegionalQueryEnabled(input),
  });
}
