import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";

type FlightPlanRegioKind = "list" | "preprepared" | "fullPrepared" | "unPrepared";
export type FlightPlanRegioQueryInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

const CONFIG: Record<FlightPlanRegioKind, {
  path: string;
  key: (regioId: string | number) => readonly unknown[];
}> = {
  list: { path: "/flightPlans", key: flightPlanKeys.list },
  preprepared: { path: "/flightPlans/prepreparedFlightPlans", key: flightPlanKeys.preprepared },
  fullPrepared: { path: "/flightPlans/fullPreparedFlightPlans", key: flightPlanKeys.fullPrepared },
  unPrepared: { path: "/flightPlans/unPreparedPlans", key: flightPlanKeys.unPrepared },
};

function useRegionalFlightPlans(kind: FlightPlanRegioKind, input: FlightPlanRegioQueryInput) {
  const config = CONFIG[kind];
  return useQuery({
    queryKey: config.key(input.regioId ?? ""),
    queryFn: () => fetchApi<FlightPlanType[]>(appendRegioQuery(config.path, input.regioId)),
    enabled: (input.enabled ?? true) && enabledForRegio(input.regioId, input.userId),
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
