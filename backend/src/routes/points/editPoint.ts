import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildPointUpdateParams,
  buildPointUpdateSql,
} from "../../helpers/queries/points/pointFields";
import { runReturningUpdateById } from "../../helpers/runReturningUpdate";

export async function editPoint(req: Request, res: Response): Promise<void> {
  const { id } = req.body;

  await runReturningUpdateById({
    res,
    id,
    runQuery: () => pool.query(buildPointUpdateSql(), buildPointUpdateParams(req.body, id)),
    config: {
      notFoundMessage: "Vluchtplan niet gevonden",
      successMessage: "Vluchtplan succesvol bijgewerkt",
      logLabel: "Error updating point:",
      errorMessage: "Failed to update point:",
    },
  });
}
