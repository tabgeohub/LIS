import { fetchApi } from "api-hooks/fetchApi";
import { pointKeys } from "lib/queryKeys";
import { EnrichedPointType } from "Types";

export function searchedPointsQuery(debounced: string) {
  return {
    queryKey: pointKeys.searched(debounced),
    queryFn: () =>
      fetchApi<EnrichedPointType[]>(`/points/searchedPoints/${debounced}`),
    enabled: debounced.length > 0,
  };
}

export function duplicateOmschrijvingCountQuery(debounced: string) {
  return {
    queryKey: pointKeys.duplicateOmschrijving(debounced),
    queryFn: () => fetchApi<number>(`/points/duplicatePoints/${debounced}`),
    enabled: debounced.length > 0,
  };
}
