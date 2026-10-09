import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "../../helpers/queries/flight-plans/buildFlightPlanQuery";
import { denyMissingPlanIdentity, denyPlanRegion, hasPlanRegionAccess, resolvePlanPrincipal } from "./planAccess";

export async function getFlightPlanById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const principal = await resolvePlanPrincipal(req);
    if (!principal) { denyMissingPlanIdentity(res); return; }
    const access = await pool.query<{ id: number; regio_id: string | null }>(
      "SELECT id, regio_id FROM lis.flightPlans WHERE id = $1", [id]
    );
    if (access.rows.length === 0) {
      res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" });
      return;
    }
    if (!hasPlanRegionAccess(principal, access.rows[0].regio_id)) { denyPlanRegion(res); return; }
    const { query, params } = buildFlightPlanQuery({
      columnPreset: "byId",
      pointPreset: "byId",
      includeGeometryJoin: true,
      where: "fp.id = $1",
      params: [id],
      orderBy: "fp.id",
    });

    const result = await pool.query(query, params);

    if (!result.rows[0]) {
      res.status(404).json({ code: "PLAN_NOT_FOUND", message: "Flight plan was not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(
      "Error fetching flight plan:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
