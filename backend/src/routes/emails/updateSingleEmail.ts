import { Request, Response } from "express";
import { pool } from "../../db";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";

export async function editSingleEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { id, email } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(`UPDATE lis.emails SET email = $1 WHERE id = $2 RETURNING *`, [
        email,
        Number(id),
      ]),
    config: {
      notFoundMessage: "E-mail niet gevonden",
      successMessage: "E-mail succesvol bijgewerkt",
      logLabel: "Error updating flight plan:",
      errorMessage: "Failed to update flight plan:",
    },
  });
}
