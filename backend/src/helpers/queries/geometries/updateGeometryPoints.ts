import { PoolClient } from "pg";
import type { PointCorePayload } from "../points/pointFields";

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
        omschrijving = $1,
        regio_id = $2,
        xcoordinaat_rd = $3,
        ycoordinaat_rd = $4,
        latitude = $5,
        longitude = $6,
        herhalen = $7,
        vertrouwelijk = $8,
        user_id = COALESCE($9, user_id),
        activiteit_id = $10,
        organisatie_id = $11,
        specifiek_letten_op = $12
      WHERE id = $13 AND geometry_id = $14`,
      [
        raw.omschrijving,
        raw.regio_id,
        raw.xcoordinaat_rd,
        raw.ycoordinaat_rd,
        raw.latitude,
        raw.longitude,
        raw.herhalen,
        raw.vertrouwelijk,
        raw.user_id,
        raw.activiteit_id,
        raw.organisatie_id,
        raw.specifiek_letten_op,
        pointId,
        geometryId,
      ]
    );
  }

  return null;
}
