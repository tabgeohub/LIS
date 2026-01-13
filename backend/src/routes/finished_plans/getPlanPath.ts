import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPlanPath(req: Request, res: Response): Promise<void> {
  const { planId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * from lis.finished_plans_path
      WHERE planid = $1
      `,
      [planId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching finished flightplans:", error);
    res.status(500).json({ message: "Failed to fetch finished flightplans" });
  }
}
