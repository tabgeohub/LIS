import { PoolClient } from "pg";
import { POINT_CORE_COLUMNS } from "./queries/pointFields";
import {
  NormalizedImportRow,
  ReturnMode,
} from "./importPointRowNormalization";

type RawImportRow = Record<string, unknown>;
type PointWithId = RawImportRow & { id: number };

export type ImportPointsDbResult = {
  createdPoints: PointWithId[];
  existingPoints: PointWithId[];
  points: Array<RawImportRow & { id: number | null }>;
};

function omschrijvingKey(raw: unknown): string {
  const record = raw as RawImportRow;
  return String(record?.omschrijving ?? "")
    .trim()
    .toLowerCase();
}

function attachIdFromMap(
  raw: unknown,
  idMap: Map<string, number>
): PointWithId | null {
  const id = idMap.get(omschrijvingKey(raw)) ?? null;
  if (id == null) {
    return null;
  }
  return { ...(raw as RawImportRow), id };
}

function attachAnyId(
  raw: unknown,
  existingMap: Map<string, number>,
  insertedMap: Map<string, number>
): RawImportRow & { id: number | null } {
  const key = omschrijvingKey(raw);
  const id = existingMap.get(key) ?? insertedMap.get(key) ?? null;
  return { ...(raw as RawImportRow), id };
}

async function loadExistingPointIds(
  client: PoolClient,
  normalized: NormalizedImportRow[]
): Promise<Map<string, number>> {
  const incomingOms = normalized.map((row) => row.omschrijving);
  const existingRes = await client.query(
    `SELECT id, omschrijving
     FROM lis.points
     WHERE omschrijving = ANY($1::text[])`,
    [incomingOms]
  );

  return new Map<string, number>(
    existingRes.rows.map((row: { id: number; omschrijving: string }) => [
      row.omschrijving.toLowerCase(),
      row.id,
    ])
  );
}

function buildBulkInsertQuery(
  toInsert: NormalizedImportRow[]
): { sql: string; params: unknown[] } {
  const cols = [...POINT_CORE_COLUMNS, "created_at"];
  const now = new Date();
  const valuesSql: string[] = [];
  const params: unknown[] = [];

  toInsert.forEach((row, index) => {
    const base = index * cols.length;
    const placeholders = cols.map((_, colIndex) => `$${base + colIndex + 1}`);
    valuesSql.push(`(${placeholders.join(", ")})`);
    params.push(
      row.omschrijving,
      row.regio_id,
      row.xcoordinaat_rd,
      row.ycoordinaat_rd,
      row.latitude,
      row.longitude,
      row.vertrouwelijk,
      row.herhalen,
      row.user_id,
      row.activiteit_id,
      row.organisatie_id,
      row.specifiek_letten_op,
      now
    );
  });

  const sql = `
    INSERT INTO lis.points (${cols.join(", ")})
    VALUES ${valuesSql.join(", ")}
    RETURNING id, omschrijving
  `;

  return { sql, params };
}

async function insertNewImportPoints(
  client: PoolClient,
  toInsert: NormalizedImportRow[]
): Promise<Map<string, number>> {
  const insertedMap = new Map<string, number>();
  if (toInsert.length === 0) {
    return insertedMap;
  }

  const { sql, params } = buildBulkInsertQuery(toInsert);
  const insertedRes = await client.query(sql, params);

  for (const row of insertedRes.rows as Array<{
    id: number;
    omschrijving: string;
  }>) {
    insertedMap.set(row.omschrijving.toLowerCase(), row.id);
  }

  return insertedMap;
}

function buildPointsForMode(
  rawRows: unknown[],
  mode: ReturnMode,
  existingMap: Map<string, number>,
  insertedMap: Map<string, number>
): Array<RawImportRow & { id: number | null }> {
  if (mode === "existing") {
    return rawRows
      .map((raw) => attachIdFromMap(raw, existingMap))
      .filter((row): row is PointWithId => row != null);
  }

  if (mode === "created") {
    return rawRows
      .map((raw) => attachIdFromMap(raw, insertedMap))
      .filter((row): row is PointWithId => row != null);
  }

  return rawRows.map((raw) => attachAnyId(raw, existingMap, insertedMap));
}

export async function importPointsInTransaction(
  client: PoolClient,
  normalized: NormalizedImportRow[],
  rawRows: unknown[],
  mode: ReturnMode
): Promise<ImportPointsDbResult> {
  const existingMap = await loadExistingPointIds(client, normalized);
  const toInsert = normalized.filter(
    (row) => !existingMap.has(row.omschrijving.toLowerCase())
  );
  const insertedMap = await insertNewImportPoints(client, toInsert);

  const existingPoints = rawRows
    .map((raw) => attachIdFromMap(raw, existingMap))
    .filter((row): row is PointWithId => row != null);

  const createdPoints = rawRows
    .map((raw) => attachIdFromMap(raw, insertedMap))
    .filter((row): row is PointWithId => row != null);

  const points = buildPointsForMode(rawRows, mode, existingMap, insertedMap);

  return { createdPoints, existingPoints, points };
}

export async function rollbackImportPointsTransaction(
  client: PoolClient
): Promise<void> {
  try {
    await client.query("ROLLBACK");
  } catch {
    // ignore rollback errors
  }
}
