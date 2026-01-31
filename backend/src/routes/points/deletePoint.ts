import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";

export async function deletePoint(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Missing point id" });
    return;
  }

  const pointId = parseInt(id, 10);
  let client: PoolClient | null = null;

  try {
    // Check if point exists
    const pointCheck = await pool.query(
      "SELECT id FROM lis.points WHERE id = $1",
      [pointId]
    );

    if (pointCheck.rowCount === 0) {
      res.status(404).json({ message: "Point not found" });
      return;
    }

    // Use transaction for cascade deletion
    client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Delete all attachments that reference this point
      const attachmentsDeleteResult = await client.query(
        `DELETE FROM lis.attachments WHERE point_id = $1`,
        [pointId]
      );

      // 2. Delete from finished_plans if this point exists there
      const finishedPlansDeleteResult = await client.query(
        `DELETE FROM lis.finished_plans WHERE point_id = $1`,
        [pointId]
      );

      // 3. Find all flight plans that contain this point
      const flightPlansResult = await client.query(
        `SELECT id, points FROM lis.flightplans WHERE $1 = ANY(points)`,
        [pointId]
      );

      // 4. Remove the point ID from each flight plan's points array
      for (const flightPlan of flightPlansResult.rows) {
        const currentPoints: number[] = flightPlan.points || [];
        const updatedPoints = currentPoints.filter(
          (pid: number) => pid !== pointId
        );

        await client.query(
          `UPDATE lis.flightplans SET points = $1::int[] WHERE id = $2`,
          [updatedPoints, flightPlan.id]
        );
      }

      // 5. Delete the point
      const deleteResult = await client.query(
        "DELETE FROM lis.points WHERE id = $1 RETURNING *",
        [pointId]
      );

      await client.query("COMMIT");

      res.status(200).json({
        message: "Point deleted successfully",
        deletedPoint: deleteResult.rows[0],
        deletedAttachments: attachmentsDeleteResult.rowCount || 0,
        deletedFinishedPlans: finishedPlansDeleteResult.rowCount || 0,
        updatedFlightPlans: flightPlansResult.rowCount || 0,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(
      "Error deleting point:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      message: `Failed to delete point. Error : ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
