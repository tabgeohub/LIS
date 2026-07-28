import { Request, Response } from "express";
import { pool } from "../../db";
import { updatePointByIdReturning } from "../../helpers/repositories/pointsRepo";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function editPoint(req: Request, res: Response): Promise<void> {
  const { id } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      updatePointByIdReturning(pool, { source: req.body, id }),
    config: {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error updating point:",
      errorMessage: "Failed to update point:",
    },
  });
}
