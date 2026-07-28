import type { Queryable } from "./queryable";

export async function selectPathsByPlanId(
  db: Queryable,
  planId: string | number
) {
  return db.query(
    `
      SELECT * from lis.finished_plans_path
      WHERE planid = $1
      `,
    [planId]
  );
}

export async function insertFinishedPlanPath(
  db: Queryable,
  input: { path: string; planId: number | string; flightTime: string | null }
) {
  return db.query(
    `INSERT INTO lis.finished_plans_path (path, planid, flighttime) VALUES ($1, $2, $3)`,
    [input.path, input.planId, input.flightTime]
  );
}

export async function deleteFinishedPlanPathByPlanId(
  db: Queryable,
  planId: string | number
) {
  return db.query(`DELETE FROM lis.finished_plans_path WHERE planid = $1`, [
    planId,
  ]);
}
