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

function hasTemplateRegioId(
  regioId: string | number | undefined
): boolean {
  return regioId !== undefined && regioId !== "";
}

function hasTemplateUserId(userId: number | undefined): boolean {
  return userId !== undefined && userId !== 0;
}

function isTemplateFlightsEnabled(input: UseTemplateFlightsInput): boolean {
  return (
    (input.enabled ?? true) &&
    hasTemplateRegioId(input.regioId) &&
    hasTemplateUserId(input.userId)
  );
}

export function useTemplateFlights(input: UseTemplateFlightsInput) {
  return useQuery({
    queryKey: templateFlightKeys.list(coalesceEmpty(input.regioId)),
    queryFn: () =>
      fetchApi<Template[]>(appendRegioQuery("/templateFlight", input.regioId)),
    enabled: isTemplateFlightsEnabled(input),
  });
}
