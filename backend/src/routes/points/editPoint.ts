import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildPointUpdateParams,
  buildPointUpdateSql,
} from "../../helpers/queries/pointFields";
import { missingFields, notFound, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function editPoint(req: Request, res: Response): Promise<void> {
  const { id } = req.body;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      buildPointUpdateSql(),
      buildPointUpdateParams(req.body, id)
    );

    if (result.rows.length === 0) {
      notFound(res, "Vluchtplan niet gevonden");
      return;
    }

    okResult(res, result.rows[0], "Vluchtplan succesvol bijgewerkt");
  } catch (err) {
    serverError(
      res,
      "Error updating point:",
      `Failed to update point: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
