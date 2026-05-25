import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import { IdNaam } from "./types";

export function useLuchtvaartuigQuery() {
  return useQuery({
    queryKey: constKeys.luchtvaartuig(),
    queryFn: () => fetchApi<IdNaam[]>("/consts/luchtvaartuig"),
    ...constsQueryOptions,
  });
}
