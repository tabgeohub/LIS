import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { templateFlightKeys } from "lib/queryKeys";
import { Template } from "./types";

export function useTemplateFlights(
  regioId: string | number | undefined,
  userId: number | undefined,
  queryEnabled = true
) {
  return useQuery({
    queryKey: templateFlightKeys.list(regioId ?? ""),
    queryFn: () => fetchApi<Template[]>(`/templateFlight?regio_id=${regioId}`),
    enabled:
      queryEnabled &&
      regioId !== undefined &&
      regioId !== "" &&
      userId !== undefined &&
      userId !== 0,
  });
}
