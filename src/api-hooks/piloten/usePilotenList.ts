import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api-hooks/fetchApi";
import { pilootKeys } from "lib/queryKeys";
import { PilootType } from "Types";

export function usePilotenList() {
  return useQuery({
    queryKey: pilootKeys.list(),
    queryFn: () => fetchApi<PilootType[]>("/piloten"),
  });
}
