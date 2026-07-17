import { constKeys } from "lib/queryKeys";
import type { IdActiviteit, IdNaam, Regio } from "./types";

export type LookupResource =
  | "activiteiten"
  | "regios"
  | "piloten"
  | "waarnemers"
  | "organisaties"
  | "luchtvaartuig";

export const LOOKUP_CONFIG: Record<
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

export type LookupDataMap = {
  activiteiten: IdActiviteit[];
  regios: Regio[];
  piloten: IdNaam[];
  waarnemers: IdNaam[];
  organisaties: IdNaam[];
  luchtvaartuig: IdNaam[];
};
