import { Request, Response } from "express";
import { pool } from "../../db";
import { runReturningUpdateById } from "../../helpers/runReturningUpdate";

export async function updateVluchtPlanPoints(
  req: Request,
  res: Response
): Promise<void> {
  const { points, id } = req.body;

  await runReturningUpdateById(
    res,
    id,
    () =>
      pool.query(
        `UPDATE lis.flightPlans SET points = $1 WHERE id = $2 RETURNING *;`,
        [points, id]
      ),
    {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error updating flight plan points:",
      errorMessage: "Bijwerken van het vluchtplan is misluktn. Error:",
    }
  );
}
