/** Shared geometry form field names used by FE drawing tool and BE insert body. */
export const GEOMETRY_FORM_FIELD_NAMES = [
  "omschrijving",
  "organisatie",
  "vertrouwelijk",
  "herhalen",
  "activiteit",
  "specifiekLettenOp",
] as const;

export type GeometryFormFields = {
  omschrijving: string;
  organisatie: string;
  vertrouwelijk: boolean;
  herhalen: boolean;
  activiteit: string;
  specifiekLettenOp: string;
};
