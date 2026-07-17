import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";
import {
  FLIGHT_PLAN_REGIO_CONFIG,
  type FlightPlanRegioKind,
  type FlightPlanRegioQueryInput,
} from "./regionalFlightPlanQueryConfig";

export type { FlightPlanRegioQueryInput } from "./regionalFlightPlanQueryConfig";

function useRegionalFlightPlans(
  kind: FlightPlanRegioKind,
  input: FlightPlanRegioQueryInput
) {
  const config = FLIGHT_PLAN_REGIO_CONFIG[kind];
  return useQuery({
    queryKey: config.key(input.regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(appendRegioQuery(config.path, input.regioId)),
    enabled:
      (input.enabled ?? true) && enabledForRegio(input.regioId, input.userId),
  });
}

export const useFlightPlansList = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("list", input);
export const useUnPreparedPlans = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("unPrepared", input);
export const usePrepreparedFlightPlans = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("preprepared", input);
export const useFullPreparedFlightPlans = (input: FlightPlanRegioQueryInput) =>
  useRegionalFlightPlans("fullPrepared", input);
