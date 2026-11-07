import { Request, Response } from "express";
import { pool } from "../../db";
import { buildSingleFinishedFlightPlanQuery } from "../../helpers/queries/finished-plans/buildFinishedPlanQuery";
import { formatFinishedPlansWithGeometries } from "../../helpers/queries/geometries/formatPlanGeometries";
import { sendSingleFinishedPlanFetchError } from "../../helpers/finished-plans/finishedPlanRouteHelpers";
import { authorizeFinishedPlan } from "./authorizeFinishedPlan";

export async function getSingleFinishedFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  const { planId } = req.params;

  try {
    if (!(await authorizeFinishedPlan(req, res, planId))) return;
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
