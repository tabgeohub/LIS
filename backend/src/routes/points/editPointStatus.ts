import { Request, Response } from "express";
import { pool } from "../../db";
import { runStatusUpdate } from "../../helpers/runReturningUpdate";

export async function editPointStatus(
  req: Request,
  res: Response
): Promise<void> {
  const { id, status } = req.body;

  await runStatusUpdate({
    res,
    id,
    runQuery: () =>
      pool.query(
        `
      UPDATE lis.points SET
        status = $1
      WHERE id = $2
      RETURNING *;
    `,
        [status, id]
      ),
    config: {
      notFoundMessage: "Aandachtspunt niet gevonden",
      successMessage: "Aandachtspunt succesvol bijgewerkt",
      logLabel: "Error updating point status:",
      errorMessage: "Failed to update point status:",
    },
  });
}
