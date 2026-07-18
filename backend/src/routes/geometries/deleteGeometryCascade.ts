import type { PoolClient } from "pg";

export async function deleteGeometryPointChildren(
  client: PoolClient,
  pointIds: number[],
  removePointIdsFromFlightPlans: (
    client: PoolClient,
    pointIds: number[]
  ) => Promise<unknown>
) {
  if (pointIds.length === 0) return;

  await client.query(
    `DELETE FROM lis.attachments WHERE point_id = ANY($1::int[])`,
    [pointIds]
  );
  await client.query(
    `DELETE FROM lis.finished_plans WHERE point_id = ANY($1::int[])`,
    [pointIds]
  );
  await removePointIdsFromFlightPlans(client, pointIds);
}

/** Delete child rows for points belonging to a geometry, then the geometry. */
export async function deleteGeometryCascade(
  client: PoolClient,
  geometryId: number,
  removePointIdsFromFlightPlans: (
    client: PoolClient,
    pointIds: number[]
  ) => Promise<unknown>
) {
  const pointsResult = await client.query(
    `SELECT id FROM lis.points WHERE geometry_id = $1`,
    [geometryId]
  );
  const pointIds = pointsResult.rows.map((row) => row.id);
  await deleteGeometryPointChildren(
    client,
    pointIds,
    removePointIdsFromFlightPlans
  );

  const pointsDeleteResult = await client.query(
    `DELETE FROM lis.points WHERE geometry_id = $1`,
    [geometryId]
  );
  const deleteResult = await client.query(
    "DELETE FROM lis.geometries WHERE id = $1 RETURNING *",
    [geometryId]
  );

  return {
    deletedGeometry: deleteResult.rows[0],
    deletedPoints: pointsDeleteResult.rowCount || 0,
    deletedAttachments: pointIds.length > 0 ? "See deleted points" : 0,
    deletedFinishedPlans: pointIds.length > 0 ? "See deleted points" : 0,
  };
}
