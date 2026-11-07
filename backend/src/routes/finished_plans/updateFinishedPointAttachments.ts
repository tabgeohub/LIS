import { Request, Response } from "express";
import { pool } from "../../db";
import { authorizeFinishedPlan } from "./authorizeFinishedPlan";
import {
  commitAttachmentUpdate,
  parseAttachmentUpdateBody,
  rejectMissingAttachmentFields,
  rollbackAttachmentUpdateError,
} from "./updateFinishedPointAttachmentsHelpers";

export async function updateFinishedPointAttachments(
  req: Request,
  res: Response
): Promise<void> {
  const parsed = parseAttachmentUpdateBody(req.body);
  if (!parsed.ok) {
    rejectMissingAttachmentFields(res);
    return;
  }

  if (!(await authorizeFinishedPlan(req, res, parsed.planId))) return;
  const client = await pool.connect();
  try {
    await commitAttachmentUpdate({
      client,
      res,
      pointId: parsed.pointId,
      planId: parsed.planId,
      attachmentIds: parsed.attachmentIds,
    });
  } catch (err) {
    await rollbackAttachmentUpdateError({ client, res, err });
  } finally {
    client.release();
  }
}
