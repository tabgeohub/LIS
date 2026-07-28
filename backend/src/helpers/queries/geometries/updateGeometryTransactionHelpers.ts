import type { PoolClient } from "pg";
import { updateGeometryOwnedPoints } from "./updateGeometryPoints";
import { selectPointsByGeometryId } from "../../repositories/pointsRepo";
import { updateGeometryMetadata } from "../../repositories/geometriesRepo";

export type UpdateGeometryTransactionInput = {
  client: PoolClient;
  geometryId: number;
  metadata: Record<string, unknown>;
  points?: unknown[];
};

type UpdateMetaResult =
  | { ok: true; geometryRow: Record<string, unknown> }
  | { ok: false; status: 400; message: string };

async function maybeUpdateOwnedPoints(
  input: UpdateGeometryTransactionInput
): Promise<string | null> {
  if (!input.points || !Array.isArray(input.points) || input.points.length === 0) {
    return null;
  }
  return updateGeometryOwnedPoints({
    client: input.client,
    geometryId: input.geometryId,
    points: input.points as Parameters<typeof updateGeometryOwnedPoints>[0]["points"],
  });
}

export async function updateGeometryMetadataAndPoints(
  input: UpdateGeometryTransactionInput
): Promise<UpdateMetaResult> {
  const geometryUpdate = await updateGeometryMetadata(input.client, {
    metadata: input.metadata,
    geometryId: input.geometryId,
  });

  const pointError = await maybeUpdateOwnedPoints(input);
  if (pointError) {
    return { ok: false, status: 400, message: pointError };
  }

  return { ok: true, geometryRow: geometryUpdate.rows[0] };
}

export async function fetchGeometryWithPoints(input: {
  client: PoolClient;
  geometryId: number;
  geometryRow: Record<string, unknown>;
}) {
  const pointsResult = await selectPointsByGeometryId(
    input.client,
    input.geometryId
  );
  return { ...input.geometryRow, points: pointsResult.rows };
}
