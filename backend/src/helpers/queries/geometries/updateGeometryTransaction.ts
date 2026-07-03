import { PoolClient } from "pg";
import {
  buildGeometryMetadataValues,
  GEOMETRY_METADATA_UPDATE_SQL,
} from "./geometryRouteHelpers";
import { updateGeometryOwnedPoints } from "./updateGeometryPoints";

export type UpdateGeometryTransactionInput = {
  client: PoolClient;
  geometryId: number;
  metadata: Record<string, unknown>;
  points?: unknown[];
};

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

  const geometryUpdate = await input.client.query(
    GEOMETRY_METADATA_UPDATE_SQL,
    buildGeometryMetadataValues(input.metadata, input.geometryId)
  );

  if (input.points && Array.isArray(input.points) && input.points.length > 0) {
    const pointError = await updateGeometryOwnedPoints({
      client: input.client,
      geometryId: input.geometryId,
      points: input.points as Parameters<typeof updateGeometryOwnedPoints>[0]["points"],
    });

    if (pointError) {
      return { ok: false as const, status: 400, message: pointError };
    }
  }

  const pointsResult = await input.client.query(
    `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
    [input.geometryId]
  );

  return {
    ok: true as const,
    result: { ...geometryUpdate.rows[0], points: pointsResult.rows },
  };
}
