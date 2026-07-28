import type { PoolClient } from "pg";
import { deleteAttachmentsByPointIds } from "../../helpers/repositories/attachmentsRepo";
import { deleteFinishedPlansByPointIds } from "../../helpers/repositories/finishedPlansRepo";
import {
  deletePointsByGeometryId,
  selectPointIdsByGeometryId,
} from "../../helpers/repositories/pointsRepo";
import { deleteGeometryById } from "../../helpers/repositories/geometriesRepo";

export async function deleteGeometryPointChildren(input: {
  client: PoolClient;
  pointIds: number[];
  removePointIdsFromFlightPlans: (
    client: PoolClient,
    pointIds: number[]
  ) => Promise<unknown>;
}) {
  const { client, pointIds, removePointIdsFromFlightPlans } = input;
  if (pointIds.length === 0) return;

  await deleteAttachmentsByPointIds(client, pointIds);
  await deleteFinishedPlansByPointIds(client, pointIds);
  await removePointIdsFromFlightPlans(client, pointIds);
}

/** Delete child rows for points belonging to a geometry, then the geometry. */
export async function deleteGeometryCascade(input: {
  client: PoolClient;
  geometryId: number;
  removePointIdsFromFlightPlans: (
    client: PoolClient,
    pointIds: number[]
  ) => Promise<unknown>;
}) {
  const { client, geometryId, removePointIdsFromFlightPlans } = input;
  const pointsResult = await selectPointIdsByGeometryId(client, geometryId);
  const pointIds = pointsResult.rows.map((row) => row.id);
  await deleteGeometryPointChildren({
    client,
    pointIds,
    removePointIdsFromFlightPlans,
  });

  const pointsDeleteResult = await deletePointsByGeometryId(client, geometryId);
  const deleteResult = await deleteGeometryById(client, geometryId);

  return {
    deletedGeometry: deleteResult.rows[0],
    deletedPoints: pointsDeleteResult.rowCount || 0,
    deletedAttachments: pointIds.length > 0 ? "See deleted points" : 0,
    deletedFinishedPlans: pointIds.length > 0 ? "See deleted points" : 0,
  };
}
