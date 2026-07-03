import { useLookupQuery } from "api-hooks/consts";
import type { IdActiviteit, IdNaam, Regio } from "api-hooks/consts/types";

export type ConstSelectResource =
  | "regios"
  | "piloten"
  | "waarnemers"
  | "organisaties"
  | "activiteiten"
  | "luchtvaartuig";

type SelectOption = { label: string; value: string };

type SelectConfig = {
  label: (item: IdNaam | IdActiviteit | Regio) => string;
  value: (item: IdNaam | IdActiviteit | Regio) => string;
  prepend: SelectOption[];
};

const SELECT_CONFIG: Record<ConstSelectResource, SelectConfig> = {
  regios: {
    label: (item) => (item as Regio).naam,
    value: (item) => item.id,
    prepend: [{ label: "ALL", value: "admin" }],
  },
  piloten: {
    label: (item) => (item as IdNaam).naam,
    value: (item) => item.id,
    prepend: [{ label: "Selecteer een piloot", value: "" }],
  },
  waarnemers: {
    label: (item) => (item as IdNaam).naam,
    value: (item) => item.id,
    prepend: [{ label: "Selecteer een waarnemer", value: "" }],
  },
  organisaties: {
    label: (item) => (item as IdNaam).naam,
    value: (item) => item.id,
    prepend: [{ label: "Selecteer een organisatie", value: "" }],
  },
  activiteiten: {
    label: (item) => (item as IdActiviteit).activiteit,
    value: (item) => item.id,
    prepend: [{ label: "Selecteer een activiteit", value: "" }],
  },
  luchtvaartuig: {
    label: (item) => (item as IdNaam).naam,
    value: (item) => item.id,
    prepend: [{ label: "Selecteer een luchtvaartuig", value: "" }],
  },
};

export function useConstSelectOptions(resource: ConstSelectResource): SelectOption[] {
  const { data } = useLookupQuery<
    IdNaam[] | IdActiviteit[] | Regio[]
  >(resource);
  const config = SELECT_CONFIG[resource];

  if (!data) return [];

  const formatted = data.map((item) => ({
    label: config.label(item),
    value: config.value(item),
  }));

  return [...config.prepend, ...formatted];
}
