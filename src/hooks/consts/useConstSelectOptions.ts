import { useLookupQuery } from "api-hooks/consts";
import type { IdActiviteit, IdNaam, Regio } from "api-hooks/consts";
import type { ConstSelectResource, SelectOption } from "./constSelectOptionsConfig";
import { mapConstSelectOptions } from "./mapConstSelectOptions";

export type { ConstSelectResource, SelectOption } from "./constSelectOptionsConfig";

export function useConstSelectOptions(
  resource: ConstSelectResource
): SelectOption[] {
  const { data } = useLookupQuery<IdNaam[] | IdActiviteit[] | Regio[]>(resource);
  return mapConstSelectOptions(resource, data);
}
