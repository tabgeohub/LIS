import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import { Regio } from "./types";

export function useRegiosQuery() {
  return useQuery({
    queryKey: constKeys.regios(),
    queryFn: () => fetchApi<Regio[]>("/consts/regios"),
    ...constsQueryOptions,
  });
}
