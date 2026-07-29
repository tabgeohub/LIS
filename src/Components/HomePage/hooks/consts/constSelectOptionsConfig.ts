import type { IdActiviteit, IdNaam, Regio } from "api-hooks/consts/types";

export type ConstSelectResource = "regios" | "piloten" | "waarnemers" | "organisaties" | "activiteiten" | "luchtvaartuig";
export type SelectOption = { label: string; value: string };
type Item = IdNaam | IdActiviteit | Regio;

const named = (placeholder: string) => ({
  label: (item: Item) => (item as IdNaam).naam,
  value: (item: Item) => item.id,
  prepend: [{ label: placeholder, value: "" }],
});

export const SELECT_CONFIG: Record<ConstSelectResource, {
  label: (item: Item) => string;
  value: (item: Item) => string;
  prepend: SelectOption[];
}> = {
  regios: {
    label: (item) => (item as Regio).naam,
    value: (item) => item.id,
    prepend: [{ label: "ALL", value: "admin" }],
  },
  piloten: named("Selecteer een piloot"),
  waarnemers: named("Selecteer een waarnemer"),
  organisaties: named("Selecteer een organisatie"),
  activiteiten: {
    label: (item) => (item as IdActiviteit).activiteit,
    value: (item) => item.id,
    prepend: [{ label: "Selecteer een activiteit", value: "" }],
  },
  luchtvaartuig: named("Selecteer een luchtvaartuig"),
};
