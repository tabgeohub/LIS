import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { pointKeys } from "lib/queryKeys";
import { EnrichedPointType } from "Types";
import { POINT_DEBOUNCE_MS } from "./constants";

export function useSearchedPoints(search: string) {
  const debouncedSearch = useDebouncedValue(search, POINT_DEBOUNCE_MS);

  return useQuery({
    queryKey: pointKeys.searched(debouncedSearch),
    queryFn: () =>
      fetchApi<EnrichedPointType[]>(
        `/points/searchedPoints/${debouncedSearch}`
      ),
    enabled: debouncedSearch.length > 0,
  });
}
