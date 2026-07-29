import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api-hooks/fetchApi";
import { pointKeys } from "lib/queryKeys";
import { EnrichedPointType } from "Types";
import { useDebouncedValue } from "lib/useDebouncedValue";
import { POINT_DEBOUNCE_MS } from "./constants";

export function useSearchedPoints(search: string) {
  const debounced = useDebouncedValue(search, POINT_DEBOUNCE_MS);
  return useQuery({
    queryKey: pointKeys.searched(debounced),
    queryFn: () => fetchApi<EnrichedPointType[]>(`/points/searchedPoints/${debounced}`),
    enabled: debounced.length > 0,
  });
}

export function useDuplicateOmschrijvingCount(omschrijving: string) {
  const debounced = useDebouncedValue(omschrijving, POINT_DEBOUNCE_MS);
  return useQuery({
    queryKey: pointKeys.duplicateOmschrijving(debounced),
    queryFn: () => fetchApi<number>(`/points/duplicatePoints/${debounced}`),
    enabled: debounced.length > 0,
  });
}
