import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import { IdActiviteit } from "./types";

export function useActiviteitenQuery() {
  return useQuery({
    queryKey: constKeys.activiteiten(),
    queryFn: () => fetchApi<IdActiviteit[]>("/consts/activiteiten"),
    ...constsQueryOptions,
  });
}
