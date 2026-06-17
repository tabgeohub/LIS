import { Request, Response } from "express";
import { pool } from "../../db";
import { buildSingleFinishedFlightPlanQuery } from "../../helpers/queries/buildFinishedPlanQuery";
import { formatFinishedPlansWithGeometries } from "../../helpers/queries/formatPlanGeometries";
import { sendSingleFinishedPlanFetchError } from "../../helpers/finishedPlanRouteHelpers";

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
  } catch (error: unknown) {
    sendSingleFinishedPlanFetchError(res, error);
  }
}
