import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import { IdNaam } from "./types";

export function useOrganisatiesQuery() {
  return useQuery({
    queryKey: constKeys.organisaties(),
    queryFn: () => fetchApi<IdNaam[]>("/consts/organisaties"),
    ...constsQueryOptions,
  });
}
