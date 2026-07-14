import { Request, Response } from "express";
import { pool } from "../../db";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function deleteSingleEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(`DELETE FROM lis.emails WHERE id = $1 RETURNING *`, [id]),
    config: {
      notFoundMessage: "E-mail niet gevonden",
      successMessage: "E-mail succesvol verwijderd",
      logLabel: "Error deleting email:",
      errorMessage: "Failed to delete email:",
    },
  });
}
