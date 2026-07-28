import { pool } from "../../../db";
import { selectAttachmentsByIds } from "../../repositories/attachmentsRepo";
import { selectAttachmentsIdForPlanPoint } from "../../repositories/finishedPlansRepo";

export async function fetchAttachmentsForPlanPoint(input: {
  planId: number;
  pointId: number;
}): Promise<Record<string, unknown>[]> {
  const finishedPlanResult = await selectAttachmentsIdForPlanPoint(pool, {
    planId: input.planId,
    pointId: input.pointId,
  });

  if (finishedPlanResult.rows.length === 0) return [];

  const attachmentsId = finishedPlanResult.rows[0].attachments_id;
  if (!attachmentsId || !Array.isArray(attachmentsId) || attachmentsId.length === 0) {
    return [];
  }

  const attachmentsResult = await selectAttachmentsByIds(pool, attachmentsId);

  return attachmentsResult.rows;
}
