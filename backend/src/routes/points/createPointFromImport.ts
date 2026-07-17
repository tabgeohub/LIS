import { Request, Response } from "express";
import { pool } from "../../db";
import {
  parseImportRequestBody,
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

    res.status(201).json({
      ok: true,
      created: outcome.result.createdPoints.length,
      existing: outcome.result.existingPoints.length,
      total: rows.length,
      points: outcome.result.points,
      createdPoints: outcome.result.createdPoints,
      existingPoints: outcome.result.existingPoints,
      message: outcome.message,
      returnMode: outcome.returnMode,
    });
  } catch (err) {
    await rollbackImportPointsTransaction(client);
    console.error("createPointFromImport error:", err);
    res.status(500).json({
      ok: false,
      message: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  } finally {
    client.release();
  }
}
