import { useLookupQuery } from "api-hooks/consts";
import type { IdActiviteit, IdNaam, Regio } from "api-hooks/consts";
import {
  ConstSelectResource,
  SELECT_CONFIG,
  SelectOption,
} from "./constSelectOptionsConfig";

export type { ConstSelectResource, SelectOption } from "./constSelectOptionsConfig";

export function useConstSelectOptions(resource: ConstSelectResource): SelectOption[] {
  const { data } = useLookupQuery<IdNaam[] | IdActiviteit[] | Regio[]>(resource);
  if (!data) return [];
  const config = SELECT_CONFIG[resource];
  return [
    ...config.prepend,
    ...data.map((item) => ({ label: config.label(item), value: config.value(item) })),
  ];
}
