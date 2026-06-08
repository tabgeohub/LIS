import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFinishedPlansWithPointsQuery } from "../../helpers/queries/buildFinishedPlanQuery";
import { formatFinishedPlansWithGeometries } from "../../helpers/queries/formatPlanGeometries";
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
  } catch (error: any) {
    console.error("❌ Error fetching finished flightplans:", error);
    res.status(500).json({
      message: "Failed to fetch finished flightplans",
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
