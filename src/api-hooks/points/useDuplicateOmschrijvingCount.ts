import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { pointKeys } from "lib/queryKeys";
import { POINT_DEBOUNCE_MS } from "./constants";

export function useDuplicateOmschrijvingCount(omschrijving: string) {
  const debounced = useDebouncedValue(omschrijving, POINT_DEBOUNCE_MS);

  return useQuery({
    queryKey: pointKeys.duplicateOmschrijving(debounced),
    queryFn: () => fetchApi<number>(`/points/duplicatePoints/${debounced}`),
    enabled: debounced.length > 0,
  });
}
