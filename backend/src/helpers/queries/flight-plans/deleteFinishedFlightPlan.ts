import { PoolClient } from "pg";
import { deleteAttachmentsByIds } from "../../repositories/attachmentsRepo";
import {
  deleteFinishedPlansByPlanId,
  selectAttachmentsIdsByPlanId,
} from "../../repositories/finishedPlansRepo";
import { deleteFinishedPlanPathByPlanId } from "../../repositories/finishedPlansPathRepo";
import { deleteFlightPlanById } from "../../repositories/flightPlansRepo";

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
  const finishedPlansResult = await selectAttachmentsIdsByPlanId(client, planId);

  const uniqueAttachmentIds = collectAttachmentIds(finishedPlansResult.rows);

  if (uniqueAttachmentIds.length > 0) {
    await deleteAttachmentsByIds(client, uniqueAttachmentIds);
  }

  await deleteFinishedPlansByPlanId(client, planId);

  const pathDeleteResult = await deleteFinishedPlanPathByPlanId(client, planId);

  const deleteResult = await deleteFlightPlanById(client, planId);

  return {
    deletedFlightPlan: deleteResult.rows[0],
    cascadeDeleted: {
      attachments: uniqueAttachmentIds.length,
      finishedPlans: finishedPlansResult.rowCount || 0,
      finishedPlansPath: pathDeleteResult.rowCount || 0,
    },
  };
}
