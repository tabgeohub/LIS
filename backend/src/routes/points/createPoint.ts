import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildPointInsertParams,
  buildPointInsertSql,
} from "../../helpers/queries/pointFields";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  serverError,
} from "../../helpers/routeResponses";
import { getMissingFields } from "../../helpers/validateBody";

export async function createPoint(req: Request, res: Response): Promise<void> {
  if (getMissingFields(req.body, ["omschrijving", "user_id"]).length > 0) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
    return;
  }

  const created_at = new Date();

  try {
    const result = await pool.query(
      `${buildPointInsertSql(["soort", "status", "created_at"])} RETURNING *`,
      buildPointInsertParams(req.body, ["permanent", "niet bezocht", created_at])
    );

    const row = result.rows[0];
    res.status(201).json({
      result: row,
      id: row.id,
      point: row,
      message: "Punt succesvol aangemaakt",
    });
  } catch (err) {
    serverError(
      res,
      "Error creating point:",
      `Error : ${err instanceof Error ? err.message : String(err)}`,
      err
    );
  }
}
