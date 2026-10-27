import type { GeometryFormFields } from "shared/geometryFormFields";

const geometryFormFieldNames = [
  "omschrijving",
  "organisatie",
  "vertrouwelijk",
  "herhalen",
  "activiteit",
  "specifiekLettenOp",
] as const satisfies readonly (keyof GeometryFormFields)[];

/** Shared geometry form fields used for create payload + point context. */
export function pickDrawingGeometryFormFields(
  store: GeometryFormFields
): GeometryFormFields {
  const picked = {} as GeometryFormFields;
  for (const key of geometryFormFieldNames) {
    picked[key] = store[key] as never;
  }
  return picked;
}
