import type { Queryable } from "./queryable";

const SELECT_ATTACHMENTS_ID_SQL = `
  SELECT attachments_id
  FROM lis.finished_plans
  WHERE plan_id = $1 AND point_id = $2
`;

export async function selectAttachmentsIdForPlanPoint(
  db: Queryable,
  input: { planId: number; pointId: number }
) {
  return db.query<{ attachments_id: number[] | null }>(
    `${SELECT_ATTACHMENTS_ID_SQL} LIMIT 1;`,
    [input.planId, input.pointId]
  );
}

export async function lockAttachmentsIdForPlanPoint(
  db: Queryable,
  input: { planId: number; pointId: number }
) {
  return db.query<{ attachments_id: number[] | null }>(
    `${SELECT_ATTACHMENTS_ID_SQL} FOR UPDATE`,
    [input.planId, input.pointId]
  );
}

export async function updateAttachmentsIdForPlanPoint(
  db: Queryable,
  input: { planId: number; pointId: number; attachmentIds: number[] }
) {
  return db.query(
    `
      UPDATE lis.finished_plans SET attachments_id = $1
      WHERE point_id = $2 AND plan_id = $3
      RETURNING *;
    `,
    [input.attachmentIds, input.pointId, input.planId]
  );
}

export async function selectAttachmentsIdsByPlanId(
  db: Queryable,
  planId: string | number
) {
  return db.query(
    `SELECT attachments_id FROM lis.finished_plans WHERE plan_id = $1`,
    [planId]
  );
}

export async function deleteFinishedPlansByPlanId(
  db: Queryable,
  planId: string | number
) {
  return db.query(`DELETE FROM lis.finished_plans WHERE plan_id = $1`, [
    planId,
  ]);
}

export async function deleteFinishedPlanByPlanAndPoint(
  db: Queryable,
  input: { planId: number; pointId: number }
) {
  return db.query(
    `DELETE FROM lis.finished_plans WHERE plan_id = $1 AND point_id = $2`,
    [input.planId, input.pointId]
  );
}

export async function deleteFinishedPlansByPointId(
  db: Queryable,
  pointId: number
) {
  return db.query(`DELETE FROM lis.finished_plans WHERE point_id = $1`, [
    pointId,
  ]);
}

export async function deleteFinishedPlansByPointIds(
  db: Queryable,
  pointIds: number[]
) {
  if (pointIds.length === 0) {
    return { rowCount: 0, rows: [] };
  }
  return db.query(
    `DELETE FROM lis.finished_plans WHERE point_id = ANY($1::int[])`,
    [pointIds]
  );
}

export async function selectMaxPointOrderForPlan(
  db: Queryable,
  planId: number
) {
  return db.query(
    `SELECT MAX(point_order) AS max_order FROM lis.finished_plans WHERE plan_id = $1`,
    [planId]
  );
}

export async function insertFinishedPlanRow(
  db: Queryable,
  values: unknown[]
) {
  return db.query(
    `INSERT INTO lis.finished_plans (point_id, plan_id, point_order, attachments_id, pointComment, status, spoed, emailadres)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    values
  );
}
