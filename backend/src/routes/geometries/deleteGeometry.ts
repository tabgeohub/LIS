import { Request, Response } from "express";
import {
  entityExists,
  parseRouteEntityId,
  removePointIdsFromFlightPlans,
  runInTransaction,
  sendDeleteError,
} from "../../helpers/entities/entityDeleteHelpers";

export async function deleteGeometry(req: Request, res: Response): Promise<void> {
  const geometryId = parseRouteEntityId(req.params.id, "geometry");

  if (geometryId == null) {
    res.status(400).json({ message: "Missing geometry id" });
    return;
  }

  try {
    if (!(await entityExists("lis.geometries", geometryId))) {
      res.status(404).json({ message: "Geometry not found" });
      return;
    }

    const result = await runInTransaction(async (client) => {
      const pointsResult = await client.query(
        `SELECT id FROM lis.points WHERE geometry_id = $1`,
        [geometryId]
      );

      const pointIds = pointsResult.rows.map((row) => row.id);

      if (pointIds.length > 0) {
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
    });

    res.status(200).json({
      message: "Geometry deleted successfully",
      ...result,
    });
  } catch (err) {
    sendDeleteError({ res, entityLabel: "geometry", err });
  }
}
