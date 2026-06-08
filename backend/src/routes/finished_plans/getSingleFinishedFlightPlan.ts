import { Request, Response } from "express";
import { pool } from "../../db";
import { buildSingleFinishedFlightPlanQuery } from "../../helpers/queries/buildFinishedPlanQuery";
import { formatFinishedPlansWithGeometries } from "../../helpers/queries/formatPlanGeometries";

export async function getSingleFinishedFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  const { planId } = req.params;

  try {
    const result = await pool.query(buildSingleFinishedFlightPlanQuery(), [
      planId,
    ]);

    if (!result.rows[0]) {
      res.status(200).json(null);
      return;
    }

    const formattedPlan = formatFinishedPlansWithGeometries([result.rows[0]])[0];

    res.status(200).json(formattedPlan);
  } catch (error: any) {
    console.error("❌ Error fetching finished flightplan:", error);
    res.status(500).json({
      message: "Failed to fetch finished flightplan",
      error: {
        name: error?.name,
        code: error?.code,
        hint: error?.hint,
        position: error?.position,
        detail: error?.detail,
        stack: error?.stack,
      },
    });
  }
}
