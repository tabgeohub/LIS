import { Request, Response } from "express";
import { pool } from "../../db";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";
import { updateFlightPlanPointsReturning } from "../../helpers/repositories/flightPlansRepo";

export async function updateVluchtPlanPoints(
  req: Request,
  res: Response
): Promise<void> {
  const { points, id } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () => updateFlightPlanPointsReturning(pool, { id, points }),
    config: {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error updating flight plan points:",
      errorMessage: "Bijwerken van het vluchtplan is misluktn. Error:",
    },
  });
}
