import { PoolClient } from "pg";
import { POINT_CORE_COLUMNS } from "./queries/points/pointFields";
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

const BULK_INSERT_COLUMNS = [...POINT_CORE_COLUMNS, "created_at"] as const;

function omschrijvingKey(raw: unknown): string {
  const record = raw as RawImportRow;
  return String(record?.omschrijving ?? "")
    .trim()
    .toLowerCase();
}

function bulkInsertRowParams(row: NormalizedImportRow, now: Date): unknown[] {
  return [
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
    now,
  ];
}

function buildBulkInsertQuery(
  toInsert: NormalizedImportRow[]
): { sql: string; params: unknown[] } {
  const colCount = BULK_INSERT_COLUMNS.length;
  const now = new Date();
  const valuesSql = toInsert.map((_, index) => {
    const base = index * colCount;
    const placeholders = BULK_INSERT_COLUMNS.map(
      (_col, colIndex) => `$${base + colIndex + 1}`
    );
    return `(${placeholders.join(", ")})`;
  });
  const params = toInsert.flatMap((row) => bulkInsertRowParams(row, now));

  const sql = `
    INSERT INTO lis.points (${BULK_INSERT_COLUMNS.join(", ")})
    VALUES ${valuesSql.join(", ")}
    RETURNING id, omschrijving
  `;

  return { sql, params };
}

/**
 * Imports point rows in an open transaction. The lookup maps are instance
 * fields so the per-row mapping methods take 0–1 parameters.
 */
class ImportPointsWriter {
  private readonly client: PoolClient;
  private readonly normalized: NormalizedImportRow[];
  private readonly rawRows: unknown[];
  private existingMap = new Map<string, number>();
  private insertedMap = new Map<string, number>();

  constructor(
    client: PoolClient,
    normalized: NormalizedImportRow[],
    rawRows: unknown[]
  ) {
    this.client = client;
    this.normalized = normalized;
    this.rawRows = rawRows;
  }

  async run(mode: ReturnMode): Promise<ImportPointsDbResult> {
    this.existingMap = await this.loadExistingPointIds();
    await this.insertNewPoints();

    return {
      createdPoints: this.collect(this.insertedMap),
      existingPoints: this.collect(this.existingMap),
      points: this.pointsForMode(mode),
    };
  }

  private async loadExistingPointIds(): Promise<Map<string, number>> {
    const incomingOms = this.normalized.map((row) => row.omschrijving);
    const res = await this.client.query(
      `SELECT id, omschrijving FROM lis.points WHERE omschrijving = ANY($1::text[])`,
      [incomingOms]
    );
    return new Map<string, number>(
      res.rows.map((row: { id: number; omschrijving: string }) => [
        row.omschrijving.toLowerCase(),
        row.id,
      ])
    );
  }

  private async insertNewPoints(): Promise<void> {
    const toInsert = this.normalized.filter(
      (row) => !this.existingMap.has(row.omschrijving.toLowerCase())
    );
    if (toInsert.length === 0) {
      return;
    }

    const { sql, params } = buildBulkInsertQuery(toInsert);
    const res = await this.client.query(sql, params);
    for (const row of res.rows as Array<{ id: number; omschrijving: string }>) {
      this.insertedMap.set(row.omschrijving.toLowerCase(), row.id);
    }
  }

  private collect(idMap: Map<string, number>): PointWithId[] {
    const result: PointWithId[] = [];
    for (const raw of this.rawRows) {
      const id = idMap.get(omschrijvingKey(raw));
      if (id != null) {
        result.push({ ...(raw as RawImportRow), id });
      }
    }
    return result;
  }

  private pointsForMode(
    mode: ReturnMode
  ): Array<RawImportRow & { id: number | null }> {
    if (mode === "existing") {
      return this.collect(this.existingMap);
    }
    if (mode === "created") {
      return this.collect(this.insertedMap);
    }
    return this.rawRows.map((raw) => {
      const key = omschrijvingKey(raw);
      const id = this.existingMap.get(key) ?? this.insertedMap.get(key) ?? null;
      return { ...(raw as RawImportRow), id };
    });
  }
}

export type ImportPointsInput = {
  normalized: NormalizedImportRow[];
  rawRows: unknown[];
  mode: ReturnMode;
};

export async function importPointsInTransaction(
  client: PoolClient,
  input: ImportPointsInput
): Promise<ImportPointsDbResult> {
  return new ImportPointsWriter(client, input.normalized, input.rawRows).run(
    input.mode
  );
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
