import { PoolClient } from "pg";
import type { PointCorePayload } from "../points/pointFields";
import {
  selectPointIdIfOwnedByGeometry,
  updateOwnedGeometryPoint,
} from "../../repositories/pointsRepo";

type PointPayload = PointCorePayload & { id?: number };

async function updateOwnedPointIfValid(input: {
  client: PoolClient;
  geometryId: number;
  raw: PointPayload;
}): Promise<string | null> {
  const { client, geometryId, raw } = input;
  if (raw.id == null) return null;

  const pointId = Number(raw.id);
  if (!Number.isFinite(pointId)) return null;

  const owner = await selectPointIdIfOwnedByGeometry(client, {
    pointId,
    geometryId,
  });

  if (owner.rowCount === 0) {
    return `Punt ${pointId} hoort niet bij deze geometrie.`;
  }

  await updateOwnedGeometryPoint(client, { raw, pointId, geometryId });
  return null;
}

export async function updateGeometryOwnedPoints(input: {
  client: PoolClient;
  geometryId: number;
  points: PointPayload[];
}): Promise<string | null> {
  const { client, geometryId, points } = input;
  if (!points.length) return null;

  for (const raw of points) {
    const error = await updateOwnedPointIfValid({ client, geometryId, raw });
    if (error) return error;
  }

  return null;
}
