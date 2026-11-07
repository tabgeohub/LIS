import { Request, Response } from "express";
import { pool } from "../../db";
import { buildPointSearchQuery } from "../../helpers/queries/points/buildPointSearchQuery";
import { denyMissingPlanIdentity, resolvePlanPrincipal } from "../flightPlans/planAccess";

export async function getSearchedPoints(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { omschrijving } = req.params;
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }

    const result = await pool.query(buildPointSearchQuery("omschrijving"), [
      `%${omschrijving}%`,
      principal.is_admin,
      principal.regio_id,
    ]);

    res.json(result.rows[0].points || []);
  } catch (err) {
    console.error(
      "Error fetching searched points:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      error: `Error fetching searched points: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
