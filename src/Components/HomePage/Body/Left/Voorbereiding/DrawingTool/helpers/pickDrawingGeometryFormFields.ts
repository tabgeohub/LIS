import type { GeometryFormFields } from "shared/geometryFormFields";
import { GEOMETRY_FORM_FIELD_NAMES } from "shared/geometryFormFields";

/** Shared geometry form fields used for create payload + point context. */
export function pickDrawingGeometryFormFields(
  store: GeometryFormFields
): GeometryFormFields {
  const picked = {} as GeometryFormFields;
  for (const key of GEOMETRY_FORM_FIELD_NAMES) {
    picked[key] = store[key] as never;
  }
  return picked;
}
