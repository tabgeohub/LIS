import { Request, Response } from "express";
import { pool } from "../../db";

export async function deletePoint(req: Request, res: Response): Promise<void> {
  const { data } = req.params;

  if (!data) {
    res.status(400).json({ message: "Missing data" });
    return;
  }

  try {
    const { point_id, plan_id, attachments } = JSON.parse(data);

    if (attachments && attachments.length > 0) {
      await pool.query(
        `DELETE FROM lis.attachments WHERE id = ANY($1::int[])`,
        [attachments]
      );
    }

    await pool.query(
      `DELETE FROM lis.finished_plans WHERE plan_id = $1 AND point_id = $2`,
      [plan_id, point_id]
    );

    await pool.query(
      `UPDATE lis.flightplans SET points = array_remove(points, $1) WHERE id = $2`,
      [point_id, plan_id]
    );

    res
      .status(200)
      .json({ message: "Point and related data removed successfully" });
  } catch (error) {
    console.error("Error removing point:", error);
    res.status(500).json({ message: "Failed to remove point" });
  }
}
