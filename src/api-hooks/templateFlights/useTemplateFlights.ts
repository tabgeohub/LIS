import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { templateFlightKeys } from "lib/queryKeys";
import { appendRegioQuery } from "../shared/regioQuery";
import { Template } from "./types";

export type UseTemplateFlightsInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

function coalesceEmpty(value: string | number | undefined): string | number {
  return value ?? "";
}

function isTemplateFlightsEnabled(input: UseTemplateFlightsInput): boolean {
  if (!(input.enabled ?? true)) return false;
  if (input.regioId === undefined || input.regioId === "") return false;
  if (input.userId === undefined || input.userId === 0) return false;
  return true;
}

export function useTemplateFlights(input: UseTemplateFlightsInput) {
  return useQuery({
    queryKey: templateFlightKeys.list(coalesceEmpty(input.regioId)),
    queryFn: () =>
      fetchApi<Template[]>(appendRegioQuery("/templateFlight", input.regioId)),
    enabled: isTemplateFlightsEnabled(input),
  });
}
