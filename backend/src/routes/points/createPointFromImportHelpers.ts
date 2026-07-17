import {
  importPointsInTransaction,
  rollbackImportPointsTransaction,
} from "../../helpers/points/createPointFromImportDb";
import {
  normalizeImportRows,
  parseReturnMode,
} from "../../helpers/points/importPointRowNormalization";
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

export { rollbackImportPointsTransaction };
