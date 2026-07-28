import type { Queryable } from "./queryable";
import {
  buildPointInsertParams,
  buildPointInsertSql,
  buildPointUpdateAssignments,
  buildPointUpdateParams,
  type PointCoreColumn,
  type PointCorePayload,
} from "../queries/points/pointFields";

export async function updatePointStatus(
  db: Queryable,
  input: { id: number | string; status: string }
) {
  return db.query(
    `
      UPDATE lis.points SET
        status = $1
      WHERE id = $2
      RETURNING *;
    `,
    [input.status, input.id]
  );
}

export async function selectPointsByOmschrijving(
  db: Queryable,
  omschrijving: string
) {
  return db.query("SELECT * FROM lis.points WHERE omschrijving = $1", [
    omschrijving,
  ]);
}

export async function selectPointIdsByOmschrijvingAny(
  db: Queryable,
  omschrijvingen: string[]
) {
  return db.query(
    `SELECT id, omschrijving FROM lis.points WHERE omschrijving = ANY($1::text[])`,
    [omschrijvingen]
  );
}

export async function selectPointsByGeometryId(
  db: Queryable,
  geometryId: number | string
) {
  return db.query(
    `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
    [geometryId]
  );
}

export async function selectPointIdsByGeometryId(
  db: Queryable,
  geometryId: number
) {
  return db.query(`SELECT id FROM lis.points WHERE geometry_id = $1`, [
    geometryId,
  ]);
}

export async function selectPointIdIfOwnedByGeometry(
  db: Queryable,
  input: { pointId: number; geometryId: number }
) {
  return db.query(
    `SELECT id FROM lis.points WHERE id = $1 AND geometry_id = $2`,
    [input.pointId, input.geometryId]
  );
}

export async function pointExistsById(db: Queryable, pointId: number) {
  const result = await db.query(`SELECT 1 FROM lis.points WHERE id = $1`, [
    pointId,
  ]);
  return (result.rowCount ?? 0) > 0;
}

export async function deletePointById(db: Queryable, pointId: number) {
  return db.query("DELETE FROM lis.points WHERE id = $1 RETURNING *", [
    pointId,
  ]);
}

export async function deletePointsByGeometryId(
  db: Queryable,
  geometryId: number
) {
  return db.query(`DELETE FROM lis.points WHERE geometry_id = $1`, [
    geometryId,
  ]);
}

export async function updatePointOmschrijvingStatus(
  db: Queryable,
  input: { id: number; omschrijving: string; status: string }
) {
  return db.query(
    `UPDATE lis.points SET omschrijving = $1, status = $2 WHERE id = $3`,
    [input.omschrijving, input.status, input.id]
  );
}

export async function insertPointReturningId(
  db: Queryable,
  input: {
    source: Record<string, unknown>;
    extraColumns: string[];
    extraValues: unknown[];
    overrides?: Partial<Record<PointCoreColumn, unknown>>;
  }
) {
  const sql = `${buildPointInsertSql(input.extraColumns)} RETURNING id`;
  const values = buildPointInsertParams({
    source: input.source,
    extraValues: input.extraValues,
    overrides: input.overrides,
  });
  return db.query(sql, values);
}

export async function updateOwnedGeometryPoint(
  db: Queryable,
  input: {
    raw: PointCorePayload & { id?: number };
    pointId: number;
    geometryId: number;
  }
) {
  return db.query(
    `UPDATE lis.points SET
      ${buildPointUpdateAssignments({ coalesceColumns: ["user_id"] })}
    WHERE id = $13 AND geometry_id = $14`,
    [...buildPointUpdateParams(input.raw, input.pointId), input.geometryId]
  );
}

export async function bulkInsertPoints(
  db: Queryable,
  input: { sql: string; params: unknown[] }
) {
  return db.query(input.sql, input.params);
}

export async function bulkInsertPointsByColumns(
  db: Queryable,
  input: {
    columns: readonly string[];
    rows: unknown[][];
  }
) {
  const colCount = input.columns.length;
  const valuesSql = input.rows.map((_, index) => {
    const base = index * colCount;
    const placeholders = input.columns.map(
      (_col, colIndex) => `$${base + colIndex + 1}`
    );
    return `(${placeholders.join(", ")})`;
  });
  const params = input.rows.flat();
  const sql = `
    INSERT INTO lis.points (${input.columns.join(", ")})
    VALUES ${valuesSql.join(", ")}
    RETURNING id, omschrijving
  `;
  return db.query(sql, params);
}
