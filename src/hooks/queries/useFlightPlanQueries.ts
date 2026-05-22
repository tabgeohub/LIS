import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";

function enabledForUser(userId: number | undefined): boolean {
  return userId !== undefined && userId !== 0;
}

function enabledForRegio(
  regioId: string | number | undefined,
  userId: number | undefined
): boolean {
  return (
    regioId !== undefined &&
    regioId !== "" &&
    enabledForUser(userId)
  );
}

/** All flight plans for a region (ViewPlan, Remove, Reuse, etc.) */
export function useFlightPlansList(
  regioId: string | number | undefined,
  userId: number | undefined,
  queryEnabled = true
) {
  return useQuery({
    queryKey: flightPlanKeys.list(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(`/flightPlans?regio_id=${regioId}`),
    enabled: queryEnabled && enabledForRegio(regioId, userId),
  });
}

/** Plans awaiting preparation */
export function useUnPreparedPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.unPrepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/unPreparedPlans?regio_id=${regioId}`
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}

/** Pre-prepared plans (add points to plan flows) */
export function usePrepreparedFlightPlans(userId: number | undefined) {
  return useQuery({
    queryKey: flightPlanKeys.preprepared(),
    queryFn: () =>
      fetchApi<FlightPlanType[]>("/flightPlans/prepreparedFlightPlans"),
    enabled: enabledForUser(userId),
  });
}

/** Fully prepared plans (nabewerking status change) */
export function useFullPreparedFlightPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.fullPrepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/fullPreparedFlightPlans?regio_id=${regioId}`
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}

/** Check if vluchtnummer already exists (returns count) */
export function useVluchtnummerExists(
  vluchtnummer: string,
  enabled = true
) {
  return useQuery({
    queryKey: flightPlanKeys.vluchtnummer(vluchtnummer),
    queryFn: () => fetchApi<number>(`/flightPlans/vluchtnummer/${vluchtnummer}`),
    enabled: enabled && vluchtnummer.length > 0,
  });
}

/** Search results for flight plans */
export function useSearchedFlightPlans(search: string) {
  return useQuery({
    queryKey: flightPlanKeys.searched(search),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/searchedFlightplan?search=${search}`
      ),
    enabled: search.length > 0,
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
