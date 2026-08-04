import type { Queryable } from "./queryable";
import { appendRegioFilter } from "../queries/shared/regioFilter";
import {
  FLIGHT_PLAN_UPDATE_COLUMNS,
  flightPlanUpdateValues,
  normalizeFlightPlanUpdateFields,
  type FlightPlanBodySource,
} from "../queries/flight-plans/flightPlanFieldNormalize";

export function buildFlightPlanUpdateSql(): string {
  const setClause = FLIGHT_PLAN_UPDATE_COLUMNS.map(
    (column, index) => `${column} = $${index + 1}`
  ).join(",\n        ");

  return `
      UPDATE lis.flightPlans SET
        ${setClause}
      WHERE id = $${FLIGHT_PLAN_UPDATE_COLUMNS.length + 1}
      RETURNING *`;
}

export function buildFlightPlanInsertSql(): string {
  const headColumns = FLIGHT_PLAN_UPDATE_COLUMNS.slice(0, 10);
  const tailColumns = [
    "user_id",
    "points",
    "regio_id",
    "basemap",
    "layers",
    "status",
    "created_at",
    "copied_from",
  ];
  const columns = [...headColumns, ...tailColumns];

  return `INSERT INTO lis.flightPlans (
        ${columns.join(",\n        ")}
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, NOW(), $17
      )
      RETURNING *`;
}

export function buildFlightPlanUpdateParams(
  source: FlightPlanBodySource,
  id: unknown
): unknown[] {
  return [...flightPlanUpdateValues(source), id];
}

export function buildFlightPlanInsertParams(
  source: FlightPlanBodySource
): unknown[] {
  const fields = normalizeFlightPlanUpdateFields(source);

  return [
    fields.vluchtnummer,
    fields.omschrijving,
    fields.waarnemer,
    fields.piloot,
    fields.datum,
    fields.vliegduur,
    fields.luchtvaartuig,
    fields.passagiers,
    fields.hoofdthema,
    fields.aanvullende,
    source.user_id,
    fields.points,
    source.regio_id,
    source.basemap,
    JSON.stringify([source.layers]),
    fields.status ?? "prepared",
    source.copiedFrom ?? null,
  ];
}

export async function insertFlightPlanReturning(
  db: Queryable,
  source: FlightPlanBodySource
) {
  return db.query(
    buildFlightPlanInsertSql(),
    buildFlightPlanInsertParams(source)
  );
}

export async function updateFlightPlanReturning(
  db: Queryable,
  source: FlightPlanBodySource,
  id: unknown
) {
  return db.query(
    buildFlightPlanUpdateSql(),
    buildFlightPlanUpdateParams(source, id)
  );
}

export async function selectFlightPlanIdsWithRegio(
  db: Queryable,
  ids: number[]
) {
  return db.query(
    `SELECT id, regio_id FROM lis.flightplans WHERE id = ANY($1::int[])`,
    [ids]
  );
}

export async function selectFlightPlanIdRegioByIds(
  db: Queryable,
  ids: number[]
) {
  return db.query(
    `SELECT id, regio_id FROM lis.flightPlans WHERE id = ANY($1::int[])`,
    [ids]
  );
}

export async function updateFlightPlanStatus(
  db: Queryable,
  input: { id: number | string; status: string }
) {
  return db.query(`UPDATE lis.flightPlans SET status = $1 WHERE id = $2`, [
    input.status,
    input.id,
  ]);
}

export async function updateFlightPlanPointsReturning(
  db: Queryable,
  input: { id: number | string; points: unknown }
) {
  return db.query(
    `UPDATE lis.flightPlans SET points = $1 WHERE id = $2 RETURNING *;`,
    [input.points, input.id]
  );
}

export async function updateFlightPlanPoints(
  db: Queryable,
  input: { id: number | string; points: unknown }
) {
  return db.query(`UPDATE lis.flightplans SET points = $1 WHERE id = $2`, [
    input.points,
    input.id,
  ]);
}

export async function setFlightPlanStatusFinished(
  db: Queryable,
  planId: number | string
) {
  return db.query(
    `UPDATE lis.flightplans SET status = 'finished' WHERE id = $1`,
    [planId]
  );
}

export async function arrayRemovePointFromFlightPlan(
  db: Queryable,
  input: { pointId: number; planId: number }
) {
  return db.query(
    `UPDATE lis.flightplans SET points = array_remove(points, $1) WHERE id = $2`,
    [input.pointId, input.planId]
  );
}

export async function selectFlightPlansByVluchtnummer(
  db: Queryable,
  vluchtnummer: string
) {
  return db.query(
    `
      SELECT *
      FROM lis.flightPlans
      WHERE vluchtnummer = $1
      ORDER BY created_at DESC
      `,
    [vluchtnummer]
  );
}

function buildPreparedFlightPlansQuery(
  selectColumns: string,
  regio_id: string | undefined,
  options?: { orderByCreatedAtDesc?: boolean }
): { query: string; params: unknown[] } {
  const params: unknown[] = [];
  let query = `
      SELECT ${selectColumns}
      FROM lis.flightPlans
      WHERE status = 'prepared'
    `;

  query = appendRegioFilter({
    sql: query,
    params,
    regio_id,
    column: "regio_id",
    options: { caseInsensitiveAdmin: true },
  });

  if (options?.orderByCreatedAtDesc) {
    query += ` ORDER BY created_at DESC`;
  }

  return { query, params };
}

export async function selectPreparedFlightPlans(
  db: Queryable,
  regio_id: string | undefined
) {
  const { query, params } = buildPreparedFlightPlansQuery(
    "id, vluchtnummer, omschrijving, datum, created_at, user_id, points",
    regio_id,
    { orderByCreatedAtDesc: true }
  );

  return db.query(query, params);
}

/** Prepared plans with regio_id — used by regio verification scripts. */
export async function selectPreparedFlightPlanIdsWithRegio(
  db: Queryable,
  regio_id: string | undefined
) {
  const { query, params } = buildPreparedFlightPlansQuery(
    "id, regio_id",
    regio_id
  );

  return db.query(query, params);
}

export async function selectFlightPlanIdStatus(
  db: Queryable,
  id: string | number
) {
  return db.query("SELECT id, status FROM lis.flightplans WHERE id = $1", [
    id,
  ]);
}

export async function deleteFlightPlanById(
  db: Queryable,
  id: string | number
) {
  return db.query("DELETE FROM lis.flightplans WHERE id = $1 RETURNING *", [
    id,
  ]);
}

export async function selectFlightPlansOverlappingPointIds(
  db: Queryable,
  pointIds: number[]
) {
  return db.query(
    `SELECT id, points FROM lis.flightplans WHERE points && $1::int[]`,
    [pointIds]
  );
}

export async function selectFlightPlansByIds(
  db: Queryable,
  ids: number[]
) {
  return db.query(
    `SELECT id, regio_id FROM lis.flightplans WHERE id = ANY($1::int[])`,
    [ids]
  );
}

export async function replaceFlightPlanPointsArray(
  db: Queryable,
  input: { id: number; points: number[] }
) {
  return db.query(
    `UPDATE lis.flightplans SET points = $1::int[] WHERE id = $2`,
    [input.points, input.id]
  );
}
