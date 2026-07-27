import {
  fetchGeometryWithPoints,
  updateGeometryMetadataAndPoints,
  type UpdateGeometryTransactionInput,
} from "./updateGeometryTransactionHelpers";

export type { UpdateGeometryTransactionInput };

export async function runGeometryUpdateTransaction(
  input: UpdateGeometryTransactionInput
) {
  const exists = await input.client.query(
    `SELECT id FROM lis.geometries WHERE id = $1`,
    [input.geometryId]
  );

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
