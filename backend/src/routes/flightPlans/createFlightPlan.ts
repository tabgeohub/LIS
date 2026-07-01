import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildFlightPlanInsertParams,
  buildFlightPlanInsertSql,
} from "../../helpers/queries/flight-plans/flightPlanFields";
import { created, missingFields, serverError } from "../../helpers/http/routeResponses";
import { getMissingFields, requireArray } from "../../helpers/http/validateBody";

export async function createFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  if (
    getMissingFields(req.body, [
      "vluchtnummer",
      "waarnemer",
      "datum",
      "user_id",
    ]).length > 0 ||
    !requireArray(req.body.points)
  ) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      buildFlightPlanInsertSql(),
      buildFlightPlanInsertParams(req.body)
    );

    created({
      res,
      result: result.rows[0],
      message: "Vluchtplan succesvol opgeslagen",
    });
  } catch (err) {
    serverError({
      res,
      logLabel: "Error creating flight plan:",
      message: `Failed to create flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
