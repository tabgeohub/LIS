import type { IdActiviteit, IdNaam, Regio } from "api-hooks/consts";
import {
  ConstSelectResource,
  SELECT_CONFIG,
  SelectOption,
} from "./constSelectOptionsConfig";

type ConstLookupItem = IdNaam | IdActiviteit | Regio;

export function mapConstSelectOptions(
  resource: ConstSelectResource,
  data: ConstLookupItem[] | undefined
): SelectOption[] {
  if (!data) return [];
  const config = SELECT_CONFIG[resource];
  return [
    ...config.prepend,
    ...data.map((item) => ({
      label: config.label(item),
      value: config.value(item),
    })),
  ];
}
