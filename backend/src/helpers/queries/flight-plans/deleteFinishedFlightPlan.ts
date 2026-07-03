import { PoolClient } from "pg";

function collectAttachmentIds(
  rows: Array<{ attachments_id: number[] | null }>
): number[] {
  const ids: number[] = [];
  rows.forEach((row) => {
    if (row.attachments_id && Array.isArray(row.attachments_id)) {
      ids.push(...row.attachments_id);
    }
  });
  return [...new Set(ids)];
}

export type FinishedPlanDeleteSummary = {
  deletedFlightPlan: Record<string, unknown>;
  cascadeDeleted: {
    attachments: number;
    finishedPlans: number;
    finishedPlansPath: number;
  };
};

export async function deleteFinishedFlightPlanCascade(
  client: PoolClient,
  planId: string
): Promise<FinishedPlanDeleteSummary> {
  const finishedPlansResult = await client.query(
    `SELECT attachments_id FROM lis.finished_plans WHERE plan_id = $1`,
    [planId]
  );

  const uniqueAttachmentIds = collectAttachmentIds(finishedPlansResult.rows);

  if (uniqueAttachmentIds.length > 0) {
    await client.query(`DELETE FROM lis.attachments WHERE id = ANY($1::int[])`, [
      uniqueAttachmentIds,
    ]);
  }

  await client.query(`DELETE FROM lis.finished_plans WHERE plan_id = $1`, [planId]);

  const pathDeleteResult = await client.query(
    `DELETE FROM lis.finished_plans_path WHERE planid = $1`,
    [planId]
  );

  const deleteResult = await client.query(
    `DELETE FROM lis.flightplans WHERE id = $1 RETURNING *`,
    [planId]
  );

  return {
    deletedFlightPlan: deleteResult.rows[0],
    cascadeDeleted: {
      attachments: uniqueAttachmentIds.length,
      finishedPlans: finishedPlansResult.rowCount || 0,
      finishedPlansPath: pathDeleteResult.rowCount || 0,
    },
  };
}
