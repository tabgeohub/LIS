import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildFlightPlanUpdateParams,
  buildFlightPlanUpdateSql,
} from "../../helpers/queries/flight-plans/flightPlanFields";
import { runReturningUpdateById } from "../../helpers/runReturningUpdate";

export async function updateVluchtPlan(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(buildFlightPlanUpdateSql(), buildFlightPlanUpdateParams(req.body, id)),
    config: {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error:",
      errorMessage: "Bijwerken van het vluchtplan mislukt. Error:",
    },
  });
}
