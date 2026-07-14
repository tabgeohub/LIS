import { PoolClient } from "pg";
import type { PointCorePayload } from "../points/pointFields";
import {
  buildPointUpdateAssignments,
  buildPointUpdateParams,
} from "../points/pointFields";

type PointPayload = PointCorePayload & { id?: number };

export async function updateGeometryOwnedPoints(input: {
  client: PoolClient;
  geometryId: number;
  points: PointPayload[];
}): Promise<string | null> {
  const { client, geometryId, points } = input;
  if (!points.length) return null;

  for (const raw of points) {
    if (raw.id == null) continue;

    const pointId = Number(raw.id);
    if (!Number.isFinite(pointId)) continue;

    const owner = await client.query(
      `SELECT id FROM lis.points WHERE id = $1 AND geometry_id = $2`,
      [pointId, geometryId]
    );

    if (owner.rowCount === 0) {
      return `Punt ${pointId} hoort niet bij deze geometrie.`;
    }

    await client.query(
      `UPDATE lis.points SET
        ${buildPointUpdateAssignments({ coalesceColumns: ["user_id"] })}
      WHERE id = $13 AND geometry_id = $14`,
      [...buildPointUpdateParams(raw, pointId), geometryId]
    );
  }

  return null;
}
