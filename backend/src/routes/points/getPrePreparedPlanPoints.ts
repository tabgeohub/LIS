import { Request, Response } from "express";
import { pool } from "../../db";
import { buildPointSearchQuery } from "../../helpers/queries/buildPointSearchQuery";

export async function getPrepreparedFlightPlanPoints(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const result = await pool.query(buildPointSearchQuery("planId"), [id]);

    res.json(result.rows[0].points || []);
  } catch (err) {
    console.error(
      "Error fetching flight plans:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      error: `Error fetching flight pre-prepared plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
