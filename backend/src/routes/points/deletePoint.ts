import { Request, Response } from "express";
import {
  entityExists,
  parseRouteEntityId,
  removePointIdsFromFlightPlans,
  runInTransaction,
  sendDeleteError,
} from "../../helpers/entityDeleteHelpers";

export async function deletePoint(req: Request, res: Response): Promise<void> {
  const pointId = parseRouteEntityId(req.params.id, "point");

  if (pointId == null) {
    res.status(400).json({ message: "Missing point id" });
    return;
  }

  try {
    if (!(await entityExists("lis.points", pointId))) {
      res.status(404).json({ message: "Point not found" });
      return;
    }

    const result = await runInTransaction(async (client) => {
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
    });

    res.status(200).json({
      message: "Point deleted successfully",
      ...result,
    });
  } catch (err) {
    sendDeleteError(res, "point", err);
  }
}
