import { Request, Response } from "express";
import { pool } from "../../db";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function deletePiloot(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(
        `DELETE FROM lis.piloten WHERE id = $1 RETURNING id, naam, status`,
        [id]
      ),
    config: {
      notFoundMessage: "Piloot niet gevonden",
      successMessage: "Piloot succesvol verwijderd",
      logLabel: "Error deleting piloot:",
      errorMessage: "Failed to delete piloot:",
    },
  });
}
