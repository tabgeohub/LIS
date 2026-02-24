import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";

export async function deleteGeometry(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Missing geometry id" });
    return;
  }

  const geometryId = parseInt(id, 10);
  let client: PoolClient | null = null;

  try {
    // Check if geometry exists
    const geometryCheck = await pool.query(
      "SELECT id FROM lis.geometries WHERE id = $1",
      [geometryId]
    );

    if (geometryCheck.rowCount === 0) {
      res.status(404).json({ message: "Geometry not found" });
      return;
    }

    // Use transaction for cascade deletion
    client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Get all points that belong to this geometry
      const pointsResult = await client.query(
        `SELECT id FROM lis.points WHERE geometry_id = $1`,
        [geometryId]
      );

      const pointIds = pointsResult.rows.map((row) => row.id);

      // 2. Delete all attachments for points in this geometry
      if (pointIds.length > 0) {
        await client.query(
          `DELETE FROM lis.attachments WHERE point_id = ANY($1::int[])`,
          [pointIds]
        );
      }

      // 3. Delete from finished_plans for points in this geometry
      if (pointIds.length > 0) {
        await client.query(
          `DELETE FROM lis.finished_plans WHERE point_id = ANY($1::int[])`,
          [pointIds]
        );
      }

      // 4. Find all flight plans that contain points from this geometry
      if (pointIds.length > 0) {
        const flightPlansResult = await client.query(
          `SELECT id, points FROM lis.flightplans WHERE points && $1::int[]`,
          [pointIds]
        );

        // 5. Remove the point IDs from each flight plan's points array
        for (const flightPlan of flightPlansResult.rows) {
          const currentPoints: number[] = flightPlan.points || [];
          const updatedPoints = currentPoints.filter(
            (pid: number) => !pointIds.includes(pid)
          );

          await client.query(
            `UPDATE lis.flightplans SET points = $1::int[] WHERE id = $2`,
            [updatedPoints, flightPlan.id]
          );
        }
      }

      // 6. Delete all points that belong to this geometry
      const pointsDeleteResult = await client.query(
        `DELETE FROM lis.points WHERE geometry_id = $1`,
        [geometryId]
      );

      // 7. Delete the geometry
      const deleteResult = await client.query(
        "DELETE FROM lis.geometries WHERE id = $1 RETURNING *",
        [geometryId]
      );

      await client.query("COMMIT");

      res.status(200).json({
        message: "Geometry deleted successfully",
        deletedGeometry: deleteResult.rows[0],
        deletedPoints: pointsDeleteResult.rowCount || 0,
        deletedAttachments: pointIds.length > 0 ? "See deleted points" : 0,
        deletedFinishedPlans: pointIds.length > 0 ? "See deleted points" : 0,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(
      "Error deleting geometry:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      message: `Failed to delete geometry. Error : ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}

