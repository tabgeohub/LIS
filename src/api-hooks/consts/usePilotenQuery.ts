import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import { IdNaam } from "./types";

export function usePilotenQuery() {
  return useQuery({
    queryKey: constKeys.piloten(),
    queryFn: () => fetchApi<IdNaam[]>("/consts/piloten"),
    ...constsQueryOptions,
  });
}
