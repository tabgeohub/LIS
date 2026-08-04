import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "lib/useDebouncedValue";
import { POINT_DEBOUNCE_MS } from "./constants";
import { searchedPointsQuery } from "./pointLookupQueryDefs";

export function useSearchedPoints(search: string) {
  const debounced = useDebouncedValue(search, POINT_DEBOUNCE_MS);
  return useQuery(searchedPointsQuery(debounced));
}
