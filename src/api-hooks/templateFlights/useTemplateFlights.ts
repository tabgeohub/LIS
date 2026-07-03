import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { templateFlightKeys } from "lib/queryKeys";
import { Template } from "./types";
import { appendRegioQuery } from "../flightPlans/regioQuery";

export type UseTemplateFlightsInput = {
  regioId: string | number | undefined;
  userId: number | undefined;
  enabled?: boolean;
};

export function useTemplateFlights(input: UseTemplateFlightsInput) {
  const { regioId, userId, enabled = true } = input;

  return useQuery({
    queryKey: templateFlightKeys.list(regioId ?? ""),
    queryFn: () =>
      fetchApi<Template[]>(appendRegioQuery("/templateFlight", regioId)),
    enabled:
      enabled &&
      regioId !== undefined &&
      regioId !== "" &&
      userId !== undefined &&
      userId !== 0,
  });
}
