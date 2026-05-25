import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import { IdNaam } from "./types";

export function useWaarnemersQuery() {
  return useQuery({
    queryKey: constKeys.waarnemers(),
    queryFn: () => fetchApi<IdNaam[]>("/consts/waarnemers"),
    ...constsQueryOptions,
  });
}
