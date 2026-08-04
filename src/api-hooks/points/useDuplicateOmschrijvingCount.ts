import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "lib/useDebouncedValue";
import { POINT_DEBOUNCE_MS } from "./constants";
import { duplicateOmschrijvingCountQuery } from "./pointLookupQueryDefs";

export function useDuplicateOmschrijvingCount(omschrijving: string) {
  const debounced = useDebouncedValue(omschrijving, POINT_DEBOUNCE_MS);
  return useQuery(duplicateOmschrijvingCountQuery(debounced));
}
