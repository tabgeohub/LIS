import {
  fetchGeometryWithPoints,
  updateGeometryMetadataAndPoints,
  type UpdateGeometryTransactionInput,
} from "./updateGeometryTransactionHelpers";
import { selectGeometryId } from "../../repositories/geometriesRepo";

export type { UpdateGeometryTransactionInput };

export async function runGeometryUpdateTransaction(
  input: UpdateGeometryTransactionInput
) {
  const exists = await selectGeometryId(input.client, input.geometryId);

  if (exists.rowCount === 0) {
    return { ok: false as const, status: 404, message: "Geometrie niet gevonden." };
  }

  const updated = await updateGeometryMetadataAndPoints(input);
  if (!updated.ok) return updated;

  return {
    ok: true as const,
    result: await fetchGeometryWithPoints({
      client: input.client,
      geometryId: input.geometryId,
      geometryRow: updated.geometryRow,
    }),
  };
}
