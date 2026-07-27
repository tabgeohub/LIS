import type { PoolClient } from "pg";
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
  const geometryUpdate = await input.client.query(
    GEOMETRY_METADATA_UPDATE_SQL,
    buildGeometryMetadataValues(input.metadata, input.geometryId)
  );

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
  const pointsResult = await input.client.query(
    `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
    [input.geometryId]
  );
  return { ...input.geometryRow, points: pointsResult.rows };
}
