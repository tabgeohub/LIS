import { Request, Response } from "express";
import { pool } from "../../db";
import { updateFlightPlanReturning } from "../../helpers/repositories/flightPlansRepo";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function updateVluchtPlan(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () => updateFlightPlanReturning(pool, req.body, id),
    config: {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error:",
      errorMessage: "Bijwerken van het vluchtplan mislukt. Error:",
    },
  });
}
