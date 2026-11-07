import { Request, Response } from "express";
import { pool } from "../../db";
import { denyMissingPlanIdentity, resolvePlanPrincipal } from "../flightPlans/planAccess";

export async function getPointsDescription(req: Request, res: Response) {
  const { omschrijving } = req.params;

  if (!omschrijving) {
    res.status(400).json({ error: "Missing omschrijving" });
    return;
  }

  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    const result = await pool.query("SELECT count(*)::int AS count FROM lis.points WHERE omschrijving=$1 AND ($2::boolean OR regio_id=$3)", [omschrijving, principal.is_admin, principal.regio_id]);

    res.json(result.rows[0]?.count ?? 0);
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);

    res.status(500).json({
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
