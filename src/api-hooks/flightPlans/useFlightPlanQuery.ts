import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { flightPlanKeys } from "lib/queryKeys";
import { templateFlightKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { Template } from "../templateFlights/types";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";

type FlightPlanRegioKind =
  | "list"
  | "preprepared"
  | "fullPrepared"
  | "unPrepared";

const REGIO_PATHS: Record<FlightPlanRegioKind, string> = {
  list: "/flightPlans",
  preprepared: "/flightPlans/prepreparedFlightPlans",
  fullPrepared: "/flightPlans/fullPreparedFlightPlans",
  unPrepared: "/flightPlans/unPreparedPlans",
};

const REGIO_KEY_FN: Record<
  FlightPlanRegioKind,
  (regioId: string | number) => readonly unknown[]
> = {
  list: flightPlanKeys.list,
  preprepared: flightPlanKeys.preprepared,
  fullPrepared: flightPlanKeys.fullPrepared,
  unPrepared: flightPlanKeys.unPrepared,
};

type FlightPlanRegioQueryInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

function useFlightPlanRegioQuery(
  kind: FlightPlanRegioKind,
  input: FlightPlanRegioQueryInput
) {
  const { regioId, userId, enabled = true } = input;

  return useQuery({
    queryKey: REGIO_KEY_FN[kind](regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        appendRegioQuery(REGIO_PATHS[kind], regioId)
      ),
    enabled: enabled && enabledForRegio(regioId, userId),
  });
}

/** All flight plans for a region (ViewPlan, Remove, Reuse, etc.) */
export function useFlightPlansList(input: FlightPlanRegioQueryInput) {
  return useFlightPlanRegioQuery("list", input);
}

/** Plans awaiting preparation */
export function useUnPreparedPlans(input: FlightPlanRegioQueryInput) {
  return useFlightPlanRegioQuery("unPrepared", input);
}

/** Pre-prepared plans (add points to plan flows) */
export function usePrepreparedFlightPlans(input: FlightPlanRegioQueryInput) {
  return useFlightPlanRegioQuery("preprepared", input);
}

/** Fully prepared plans (nabewerking status change) */
export function useFullPreparedFlightPlans(input: FlightPlanRegioQueryInput) {
  return useFlightPlanRegioQuery("fullPrepared", input);
}

/** Search results for flight plans */
export function useSearchedFlightPlans(search: string) {
  const debouncedSearch = useDebouncedValue(search, FLIGHT_PLAN_DEBOUNCE_MS);

  return useQuery({
    queryKey: flightPlanKeys.searched(debouncedSearch),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/searchedFlightplan?search=${debouncedSearch}`
      ),
    enabled: debouncedSearch.length > 0,
  });
}

/** Check if vluchtnummer already exists (returns count) */
export function useVluchtnummerExists(vluchtnummer: string, enabled = true) {
  const debouncedVluchtnummer = useDebouncedValue(
    vluchtnummer,
    FLIGHT_PLAN_DEBOUNCE_MS
  );

  return useQuery({
    queryKey: flightPlanKeys.vluchtnummer(debouncedVluchtnummer),
    queryFn: () =>
      fetchApi<number>(`/flightPlans/vluchtnummer/${debouncedVluchtnummer}`),
    enabled: enabled && debouncedVluchtnummer.length > 0,
  });
}

/** Flight plans linked to a point */
export function usePointFlightPlans(pointId: number | undefined) {
  return useQuery({
    queryKey: flightPlanKeys.byPoint(pointId ?? 0),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(`/points/flightPlans/${pointId}`),
    enabled: pointId !== undefined && pointId > 0,
  });
}

export type UseTemplateFlightsInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

/** Template flight plans for a region */
export function useTemplateFlights(input: UseTemplateFlightsInput) {
  const { regioId, userId, enabled = true } = input;

  return useQuery({
    queryKey: templateFlightKeys.list(regioId ?? ""),
    queryFn: () =>
      fetchApi<Template[]>(appendRegioQuery("/templateFlight", regioId)),
    enabled:
      enabled &&
      regioId !== undefined &&
      regioId !== "" &&
      userId !== undefined &&
      userId !== 0,
  });
}
