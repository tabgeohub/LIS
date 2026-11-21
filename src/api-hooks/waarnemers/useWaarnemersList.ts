import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api-hooks/fetchApi";
import { waarnemerKeys } from "lib/queryKeys";
import { WaarnemerType } from "Types";

export function useWaarnemersList() {
  return useQuery({
    queryKey: waarnemerKeys.list(),
    queryFn: () => fetchApi<WaarnemerType[]>("/waarnemers"),
  });
}
