import type { PoolClient } from "pg";
import { deleteOrphanedAttachments } from "../../repositories/attachmentsRepo";
import {
  lockAttachmentsIdForPlanPoint,
  updateAttachmentsIdForPlanPoint,
} from "../../repositories/finishedPlansRepo";

type AttachmentUpdateInput = {
  client: PoolClient;
  pointId: number;
  planId: number;
  attachmentIds: number[];
};

async function lockFinishedPlanAttachments(
  input: Pick<AttachmentUpdateInput, "client" | "pointId" | "planId">
): Promise<number[] | null> {
  const existing = await lockAttachmentsIdForPlanPoint(input.client, {
    pointId: input.pointId,
    planId: input.planId,
  });

  if (existing.rows.length === 0) {
    return null;
  }
  return existing.rows[0].attachments_id || [];
}

export async function updateFinishedPointAttachmentsTx(
  input: AttachmentUpdateInput
): Promise<
  | { ok: true; row: Record<string, unknown> }
  | { ok: false; status: 404; message: string }
> {
  const { client, pointId, planId, attachmentIds } = input;

  const oldIds = await lockFinishedPlanAttachments({ client, pointId, planId });
  if (oldIds == null) {
    return {
      ok: false,
      status: 404,
      message: "Geen bestaande attachment gevonden.",
    };
  }

  const removed = oldIds.filter((id) => !attachmentIds.includes(id));
  const result = await updateAttachmentsIdForPlanPoint(client, {
    pointId,
    planId,
    attachmentIds,
  });
  await deleteOrphanedAttachments(client, removed);

  return { ok: true, row: result.rows[0] };
}
