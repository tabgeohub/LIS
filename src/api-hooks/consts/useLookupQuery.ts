import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constsQueryOptions } from "./queryOptions";
import { LOOKUP_CONFIG, type LookupResource } from "./lookupConfig";

export type { LookupResource, LookupDataMap } from "./lookupConfig";

export function useLookupQuery<T>(resource: LookupResource) {
  const { path, key } = LOOKUP_CONFIG[resource];
  return useQuery({
    queryKey: key(),
    queryFn: () => fetchApi<T>(path),
    ...constsQueryOptions,
  });
}
