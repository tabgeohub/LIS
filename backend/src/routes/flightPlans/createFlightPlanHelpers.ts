import type { Response } from "express";
import { pool } from "../../db";
import {
  buildFlightPlanInsertParams,
  buildFlightPlanInsertSql,
  type FlightPlanBodySource,
} from "../../helpers/queries/flight-plans/flightPlanFields";
import { created, serverError } from "../../helpers/http/routeResponses";
import { getMissingFields, requireArray } from "../../helpers/http/validateBody";

const REQUIRED_FIELDS = ["vluchtnummer", "waarnemer", "datum", "user_id"];

export function isValidCreateFlightPlanBody(
  body: Record<string, unknown>
): boolean {
  return (
    getMissingFields(body, REQUIRED_FIELDS).length === 0 &&
    requireArray(body.points)
  );
}

export async function insertAndRespondFlightPlan(
  body: FlightPlanBodySource,
  res: Response
): Promise<void> {
  const result = await pool.query(
    buildFlightPlanInsertSql(),
    buildFlightPlanInsertParams(body)
  );
  created({
    res,
    result: result.rows[0],
    message: "Vluchtplan succesvol opgeslagen",
  });
}

export function respondCreateFlightPlanError(
  res: Response,
  err: unknown
): void {
  serverError({
    res,
    logLabel: "Error creating flight plan:",
    message: `Failed to create flight plan: ${
      err instanceof Error ? err.message : String(err)
    }`,
    err,
  });
}
