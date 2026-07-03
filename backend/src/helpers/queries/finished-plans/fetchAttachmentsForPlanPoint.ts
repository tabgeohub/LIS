import { pool } from "../../../db";

export async function fetchAttachmentsForPlanPoint(input: {
  planId: number;
  pointId: number;
}): Promise<Record<string, unknown>[]> {
  const finishedPlanResult = await pool.query<{ attachments_id: number[] | null }>(
    `
      SELECT attachments_id
      FROM lis.finished_plans
      WHERE plan_id = $1 AND point_id = $2
      LIMIT 1;
    `,
    [input.planId, input.pointId]
  );

  if (finishedPlanResult.rows.length === 0) return [];

  const attachmentsId = finishedPlanResult.rows[0].attachments_id;
  if (!attachmentsId || !Array.isArray(attachmentsId) || attachmentsId.length === 0) {
    return [];
  }

  const attachmentsResult = await pool.query(
    `
      SELECT *
      FROM lis.attachments
      WHERE id = ANY($1::int[])
      ORDER BY taken_at ASC;
    `,
    [attachmentsId]
  );

  return attachmentsResult.rows;
}
