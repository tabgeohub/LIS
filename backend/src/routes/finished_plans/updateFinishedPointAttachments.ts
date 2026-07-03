import { Request, Response } from "express";
import { pool } from "../../db";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  notFound,
  okResult,
  serverError,
} from "../../helpers/http/routeResponses";
import { requireArray } from "../../helpers/http/validateBody";
import { updateFinishedPointAttachmentsTx } from "../../helpers/queries/finished-plans/updateFinishedPointAttachmentsTx";

export async function updateFinishedPointAttachments(
  req: Request,
  res: Response
): Promise<void> {
  const { point_id, plan_id, attachments_id } = req.body;

  if (point_id == null || plan_id == null || !requireArray(attachments_id)) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
    return;
  }

  const newIds: number[] = attachments_id.map((id: unknown) => Number(id));
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await updateFinishedPointAttachmentsTx({
      client,
      pointId: point_id,
      planId: plan_id,
      attachmentIds: newIds,
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
  } catch (err) {
    await client.query("ROLLBACK");
    serverError({
      res,
      logLabel: "Error updating point:",
      message: `Failed to update point: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  } finally {
    client.release();
  }
}
