import { Request, Response } from "express";
import { pool } from "../../db";
import {
  parseImportRequestBody,
  respondImportError,
  respondImportSuccess,
  rollbackImportPointsTransaction,
  runImportPointsTransaction,
} from "./createPointFromImportHelpers";

export async function createPointFromImport(
  req: Request,
  res: Response
): Promise<void> {
  const { rows, mode } = parseImportRequestBody(req.body);

  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({
      ok: false,
      message: "Body must contain a non-empty 'rows' array.",
    });
    return;
  }

  const client = await pool.connect();
  try {
    const outcome = await runImportPointsTransaction({ client, rows, mode });
    if (!outcome.ok) {
      res.status(400).json({ ok: false, message: outcome.message });
      return;
    }
    respondImportSuccess({ res, outcome, total: rows.length });
  } catch (err) {
    await rollbackImportPointsTransaction(client);
    respondImportError(res, err);
  } finally {
    client.release();
  }
}
