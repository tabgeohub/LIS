import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFinishedPlansWithPointsQuery } from "../../helpers/queries/finished-plans/buildFinishedPlanQuery";
import { formatFinishedPlansWithGeometries } from "../../helpers/queries/geometries/formatPlanGeometries";
import { sendFinishedPlanFetchError } from "../../helpers/finishedPlanRouteHelpers";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

export async function getPartialFinishedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);

    const { query, params } = buildFinishedPlansWithPointsQuery({ regio_id });

    const result = await pool.query(query, params);
    const formattedPlans = formatFinishedPlansWithGeometries(result.rows);

    res.status(200).json(formattedPlans);
  } catch (error: unknown) {
    sendFinishedPlanFetchError(res, error);
  }
}
