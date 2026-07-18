import type { PoolClient } from "pg";
import { removePointIdsFromFlightPlans } from "../../helpers/entities/entityDeleteHelpers";

export async function deletePointInTransaction(
  client: PoolClient,
  pointId: number
) {
  const attachmentsDeleteResult = await client.query(
    `DELETE FROM lis.attachments WHERE point_id = $1`,
    [pointId]
  );

  const finishedPlansDeleteResult = await client.query(
    `DELETE FROM lis.finished_plans WHERE point_id = $1`,
    [pointId]
  );

  const updatedFlightPlans = await removePointIdsFromFlightPlans(client, [
    pointId,
  ]);

  const deleteResult = await client.query(
    "DELETE FROM lis.points WHERE id = $1 RETURNING *",
    [pointId]
  );

  return {
    deletedPoint: deleteResult.rows[0],
    deletedAttachments: attachmentsDeleteResult.rowCount || 0,
    deletedFinishedPlans: finishedPlansDeleteResult.rowCount || 0,
    updatedFlightPlans,
  };
}
