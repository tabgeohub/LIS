import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFinishedPlansWithPointsQuery } from "../../helpers/queries/finished-plans/buildFinishedPlanQuery";
import { formatFinishedPlansWithGeometries } from "../../helpers/queries/geometries/formatPlanGeometries";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";

export async function getFinishedPlansTimeslider(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({
        message: "Query params 'from' and 'to' are required (YYYY-MM-DD)",
      });
      return;
    }

    const { query, params } = buildFinishedPlansWithPointsQuery({
      regio_id,
      dateRange: { from: String(from), to: String(to) },
      orderBy: "fp.datum DESC NULLS LAST, fp.created_at DESC",
    });

    const result = await pool.query(query, params);
    const formattedPlans = formatFinishedPlansWithGeometries(result.rows);

    res.status(200).json(formattedPlans);
  } catch (error: any) {
    console.error("❌ Error fetching timeslider finished plans:", error);
    res.status(500).json({
      message: "Failed to fetch finished plans for timeslider",
      error: {
        name: error?.name,
        code: error?.code,
        detail: error?.detail,
      },
    });
  }
}
