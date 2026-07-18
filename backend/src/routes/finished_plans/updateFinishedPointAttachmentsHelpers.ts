import type { Response } from "express";
import type { PoolClient } from "pg";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  notFound,
  okResult,
} from "../../helpers/http/routeResponses";
import { rollbackTransactionWithServerError } from "../../helpers/http/rollbackTransactionWithServerError";
import { requireArray } from "../../helpers/http/validateBody";
import { updateFinishedPointAttachmentsTx } from "../../helpers/queries/finished-plans/updateFinishedPointAttachmentsTx";

export function parseAttachmentUpdateBody(body: {
  point_id?: unknown;
  plan_id?: unknown;
  attachments_id?: unknown;
}):
  | { ok: false }
  | { ok: true; pointId: number; planId: number; attachmentIds: number[] } {
  const { point_id, plan_id, attachments_id } = body;
  if (point_id == null || plan_id == null || !requireArray(attachments_id)) {
    return { ok: false };
  }
  return {
    ok: true,
    pointId: point_id as number,
    planId: plan_id as number,
    attachmentIds: (attachments_id as unknown[]).map((id) => Number(id)),
  };
}

export function rejectMissingAttachmentFields(res: Response): void {
  missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
}

export async function commitAttachmentUpdate(input: {
  client: PoolClient;
  res: Response;
  pointId: number;
  planId: number;
  attachmentIds: number[];
}): Promise<void> {
  const { client, res, pointId, planId, attachmentIds } = input;
  await client.query("BEGIN");

  const result = await updateFinishedPointAttachmentsTx({
    client,
    pointId,
    planId,
    attachmentIds,
  });

  if (!result.ok) {
    await client.query("ROLLBACK");
    notFound(res, result.message);
    return;
  }

  await client.query("COMMIT");
  okResult({
    res,
    result: result.row,
    message: "Attachment succesvol bijgewerkt.",
  });
}

export async function rollbackAttachmentUpdateError(input: {
  client: PoolClient;
  res: Response;
  err: unknown;
}): Promise<void> {
  await rollbackTransactionWithServerError({
    ...input,
    logLabel: "Error updating point:",
    messagePrefix: "Failed to update point: ",
  });
}
