import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields } from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function updatePiloot(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { naam, status } = req.body as { naam?: string; status?: string };

  if (getMissingFields(req.body, ["naam", "status"]).length > 0) {
    missingFields(res);
    return;
  }

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(
        `UPDATE lis.piloten SET naam = $1, status = $2 WHERE id = $3 RETURNING id, naam, status`,
        [naam, status, id]
      ),
    config: {
      notFoundMessage: "Piloot niet gevonden",
      successMessage: "Piloot succesvol bijgewerkt",
      logLabel: "Error updating piloot:",
      errorMessage: "Failed to update piloot:",
    },
  });
}
