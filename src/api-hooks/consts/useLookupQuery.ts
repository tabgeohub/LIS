import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { constKeys } from "lib/queryKeys";
import { constsQueryOptions } from "./queryOptions";
import type { IdActiviteit, IdNaam, Regio } from "./types";

export type LookupResource =
  | "activiteiten"
  | "regios"
  | "piloten"
  | "waarnemers"
  | "organisaties"
  | "luchtvaartuig";

const LOOKUP_CONFIG: Record<
  LookupResource,
  { path: string; key: () => readonly unknown[] }
> = {
  activiteiten: { path: "/consts/activiteiten", key: constKeys.activiteiten },
  regios: { path: "/consts/regios", key: constKeys.regios },
  piloten: { path: "/consts/piloten", key: constKeys.piloten },
  waarnemers: { path: "/consts/waarnemers", key: constKeys.waarnemers },
  organisaties: { path: "/consts/organisaties", key: constKeys.organisaties },
  luchtvaartuig: { path: "/consts/luchtvaartuig", key: constKeys.luchtvaartuig },
};

export function useLookupQuery<T>(resource: LookupResource) {
  const { path, key } = LOOKUP_CONFIG[resource];
  return useQuery({
    queryKey: key(),
    queryFn: () => fetchApi<T>(path),
    ...constsQueryOptions,
  });
}

export type LookupDataMap = {
  activiteiten: IdActiviteit[];
  regios: Regio[];
  piloten: IdNaam[];
  waarnemers: IdNaam[];
  organisaties: IdNaam[];
  luchtvaartuig: IdNaam[];
};
