import { Request, Response } from "express";
import { pool } from "../../db";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function updateVluchtPlanPoints(
  req: Request,
  res: Response
): Promise<void> {
  const { points, id } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(
        `UPDATE lis.flightPlans SET points = $1 WHERE id = $2 RETURNING *;`,
        [points, id]
      ),
    config: {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error updating flight plan points:",
      errorMessage: "Bijwerken van het vluchtplan is misluktn. Error:",
    },
  });
}
