import { Request, Response } from "express";
import { pool } from "../../db";
import {
  importPointsInTransaction,
  rollbackImportPointsTransaction,
} from "../../helpers/points/createPointFromImportDb";
import {
  normalizeImportRows,
  parseReturnMode,
} from "../../helpers/points/importPointRowNormalization";

export async function createPointFromImport(
  req: Request,
  res: Response
): Promise<void> {
  const { rows, returnMode } = (req.body ?? {}) as {
    rows?: unknown;
    returnMode?: unknown;
  };
  const mode = parseReturnMode(returnMode);

  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({
      ok: false,
      message: "Body must contain a non-empty 'rows' array.",
    });
    return;
  }

  const normalized = normalizeImportRows(rows);
  if (normalized.length === 0) {
    res.status(400).json({
      ok: false,
      message: "No valid rows after normalization.",
    });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await importPointsInTransaction(client, {
      normalized,
      rawRows: rows,
      mode,
    });
    await client.query("COMMIT");

    res.status(201).json({
      ok: true,
      created: result.createdPoints.length,
      existing: result.existingPoints.length,
      total: rows.length,
      points: result.points,
      createdPoints: result.createdPoints,
      existingPoints: result.existingPoints,
      message: "Import verwerkt.",
      returnMode: mode,
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
