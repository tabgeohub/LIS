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

export function respondImportSuccess(input: {
  res: Response;
  outcome: ImportSuccess;
  total: number;
}): void {
  input.res.status(201).json({
    ok: true,
    created: input.outcome.result.createdPoints.length,
    existing: input.outcome.result.existingPoints.length,
    total: input.total,
    points: input.outcome.result.points,
    createdPoints: input.outcome.result.createdPoints,
    existingPoints: input.outcome.result.existingPoints,
    message: input.outcome.message,
    returnMode: input.outcome.returnMode,
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
