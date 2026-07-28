import type { Queryable } from "./queryable";
import { appendRegioFilter } from "../queries/shared/regioFilter";

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

export async function selectPreparedFlightPlans(
  db: Queryable,
  regio_id: string | undefined
) {
  const params: unknown[] = [];
  let query = `
      SELECT id, vluchtnummer, omschrijving, datum, created_at, user_id, points
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
  query += ` ORDER BY created_at DESC`;

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

export async function replaceFlightPlanPointsArray(
  db: Queryable,
  input: { id: number; points: number[] }
) {
  return db.query(
    `UPDATE lis.flightplans SET points = $1::int[] WHERE id = $2`,
    [input.points, input.id]
  );
}
