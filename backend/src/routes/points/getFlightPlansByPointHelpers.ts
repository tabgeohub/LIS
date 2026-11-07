import type { Response } from "express";
import { pool } from "../../db";
import { selectFlightPlansByPointId } from "../../helpers/queries/flight-plans/flightPlansByPointQuery";

export async function queryFlightPlansByPoint(
  pointId: string,
  principal: { is_admin: boolean; regio_id: string | null }
): Promise<unknown[]> {
  const result = await selectFlightPlansByPointId(pool, parseInt(pointId, 10), principal);
  return result.rows;
}

export function sendFlightPlansByPointError(
  res: Response,
  err: unknown
): void {
  console.error(
    "Error fetching flight plans by point:",
    err instanceof Error ? err.message : String(err)
  );
  res.status(500).json({
    message: `Failed to fetch flight plans. Error: ${
      err instanceof Error ? err.message : String(err)
    }`,
  });
}
