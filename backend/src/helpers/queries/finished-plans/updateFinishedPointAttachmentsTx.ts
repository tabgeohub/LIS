import type { PoolClient } from "pg";

type AttachmentUpdateInput = {
  client: PoolClient;
  pointId: number;
  planId: number;
  attachmentIds: number[];
};

async function lockFinishedPlanAttachments(
  client: PoolClient,
  pointId: number,
  planId: number
): Promise<number[] | null> {
  const existing = await client.query<{ attachments_id: number[] | null }>(
    `
      SELECT attachments_id
      FROM lis.finished_plans
      WHERE point_id = $1 AND plan_id = $2
      FOR UPDATE
    `,
    [pointId, planId]
  );

  if (existing.rows.length === 0) {
    return null;
  }
  return existing.rows[0].attachments_id || [];
}

async function applyFinishedPlanAttachmentIds(
  client: PoolClient,
  pointId: number,
  planId: number,
  attachmentIds: number[]
): Promise<Record<string, unknown>> {
  const result = await client.query(
    `
      UPDATE lis.finished_plans SET attachments_id = $1
      WHERE point_id = $2 AND plan_id = $3
      RETURNING *;
    `,
    [attachmentIds, pointId, planId]
  );
  return result.rows[0];
}

async function deleteOrphanedAttachments(
  client: PoolClient,
  removed: number[]
): Promise<void> {
  if (removed.length === 0) {
    return;
  }
  await client.query(
    `
      DELETE FROM lis.attachments a
      WHERE a.id = ANY($1::int[])
      AND NOT EXISTS (
        SELECT 1 FROM lis.finished_plans fp
        WHERE a.id = ANY(fp.attachments_id)
      )
    `,
    [removed]
  );
}

export async function updateFinishedPointAttachmentsTx(
  input: AttachmentUpdateInput
): Promise<
  | { ok: true; row: Record<string, unknown> }
  | { ok: false; status: 404; message: string }
> {
  const { client, pointId, planId, attachmentIds } = input;

  const oldIds = await lockFinishedPlanAttachments(client, pointId, planId);
  if (oldIds == null) {
    return {
      ok: false,
      status: 404,
      message: "Geen bestaande attachment gevonden.",
    };
  }

  const removed = oldIds.filter((id) => !attachmentIds.includes(id));
  const row = await applyFinishedPlanAttachmentIds(
    client,
    pointId,
    planId,
    attachmentIds
  );
  await deleteOrphanedAttachments(client, removed);

  return { ok: true, row };
}
