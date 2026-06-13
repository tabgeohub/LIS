import { Request, Response } from "express";
import { pool } from "../../db";
import { runStatusUpdate } from "../../helpers/runReturningUpdate";

export async function updateFlightPlanStatus(
  req: Request,
  res: Response
): Promise<void> {
  const { id, status } = req.body;

  await runStatusUpdate(
    res,
    id,
    () =>
      pool.query(`UPDATE lis.flightPlans SET status = $1 WHERE id = $2`, [
        status,
        id,
      ]),
    {
      successMessage: "Status van het vluchtplan succesvol bijgewerkt",
      logLabel: "Fout bij het bijwerken van het vluchtplan:",
      errorMessage: "Bijwerken van het vluchtplan mislukt: Error:",
    }
  );
}
