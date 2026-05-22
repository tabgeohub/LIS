import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { templateFlightKeys } from "lib/queryKeys";

type TemplatePoint = { id: number; omschrijving: string };
export type Template = { id: number; name: string; points: TemplatePoint[] };

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
