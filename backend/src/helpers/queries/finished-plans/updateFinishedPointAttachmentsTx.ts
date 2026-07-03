import type { PoolClient } from "pg";

type AttachmentUpdateInput = {
  client: PoolClient;
  pointId: number;
  planId: number;
  attachmentIds: number[];
};

export async function updateFinishedPointAttachmentsTx(
  input: AttachmentUpdateInput
): Promise<
  | { ok: true; row: Record<string, unknown> }
  | { ok: false; status: 404; message: string }
> {
  const { client, pointId, planId, attachmentIds } = input;

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
    return { ok: false, status: 404, message: "Geen bestaande attachment gevonden." };
  }

  const oldIds: number[] = existing.rows[0].attachments_id || [];
  const removed = oldIds.filter((id) => !attachmentIds.includes(id));

  const result = await client.query(
    `
      UPDATE lis.finished_plans SET attachments_id = $1
      WHERE point_id = $2 AND plan_id = $3
      RETURNING *;
    `,
    [attachmentIds, pointId, planId]
  );

  if (removed.length > 0) {
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

  return { ok: true, row: result.rows[0] };
}
