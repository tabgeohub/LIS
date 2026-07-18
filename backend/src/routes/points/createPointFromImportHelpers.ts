import {
  importPointsInTransaction,
  rollbackImportPointsTransaction,
} from "../../helpers/points/createPointFromImportDb";
import {
  normalizeImportRows,
  parseReturnMode,
} from "../../helpers/points/importPointRowNormalization";
import type { Response } from "express";
import type { PoolClient } from "pg";

export function parseImportRequestBody(body: unknown) {
  const { rows, returnMode } = (body ?? {}) as {
    rows?: unknown;
    returnMode?: unknown;
  };
  return {
    rows,
    mode: parseReturnMode(returnMode),
  };
}

export async function runImportPointsTransaction(input: {
  client: PoolClient;
  rows: unknown[];
  mode: ReturnType<typeof parseReturnMode>;
}) {
  const normalized = normalizeImportRows(input.rows);
  if (normalized.length === 0) {
    return { ok: false as const, message: "No valid rows after normalization." };
  }

  await input.client.query("BEGIN");
  const result = await importPointsInTransaction(input.client, {
    normalized,
    rawRows: input.rows,
    mode: input.mode,
  });
  await input.client.query("COMMIT");

  return {
    ok: true as const,
    result,
    message: "Import verwerkt.",
    returnMode: input.mode,
  };
}

type ImportSuccess = Extract<
  Awaited<ReturnType<typeof runImportPointsTransaction>>,
  { ok: true }
>;

export function respondImportSuccess(
  res: Response,
  outcome: ImportSuccess,
  total: number
): void {
  res.status(201).json({
    ok: true,
    created: outcome.result.createdPoints.length,
    existing: outcome.result.existingPoints.length,
    total,
    points: outcome.result.points,
    createdPoints: outcome.result.createdPoints,
    existingPoints: outcome.result.existingPoints,
    message: outcome.message,
    returnMode: outcome.returnMode,
  });
}

export function respondImportError(res: Response, err: unknown): void {
  console.error("createPointFromImport error:", err);
  res.status(500).json({
    ok: false,
    message: `Error: ${err instanceof Error ? err.message : String(err)}`,
  });
}

export { rollbackImportPointsTransaction };
