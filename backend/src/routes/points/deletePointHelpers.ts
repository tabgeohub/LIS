import type { PoolClient } from "pg";
import { removePointIdsFromFlightPlans } from "../../helpers/entities/entityDeleteHelpers";
import { deleteAttachmentsByPointId } from "../../helpers/repositories/attachmentsRepo";
import { deleteFinishedPlansByPointId } from "../../helpers/repositories/finishedPlansRepo";
import { deletePointById } from "../../helpers/repositories/pointsRepo";

export async function deletePointInTransaction(
  client: PoolClient,
  pointId: number
) {
  const attachmentsDeleteResult = await deleteAttachmentsByPointId(
    client,
    pointId
  );

  const finishedPlansDeleteResult = await deleteFinishedPlansByPointId(
    client,
    pointId
  );

  const updatedFlightPlans = await removePointIdsFromFlightPlans(client, [
    pointId,
  ]);

  const deleteResult = await deletePointById(client, pointId);

  return {
    deletedPoint: deleteResult.rows[0],
    deletedAttachments: attachmentsDeleteResult.rowCount || 0,
    deletedFinishedPlans: finishedPlansDeleteResult.rowCount || 0,
    updatedFlightPlans,
  };
}
