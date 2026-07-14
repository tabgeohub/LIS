import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { templateFlightKeys } from "lib/queryKeys";
import { appendRegioQuery } from "../flightPlans/regioQuery";
import { Template } from "./types";

export type UseTemplateFlightsInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

export function useTemplateFlights(input: UseTemplateFlightsInput) {
  return useQuery({
    queryKey: templateFlightKeys.list(input.regioId ?? ""),
    queryFn: () => fetchApi<Template[]>(appendRegioQuery("/templateFlight", input.regioId)),
    enabled:
      (input.enabled ?? true) &&
      input.regioId !== undefined &&
      input.regioId !== "" &&
      input.userId !== undefined &&
      input.userId !== 0,
  });
}
