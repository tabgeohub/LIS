import type { Response } from "express";
import { pool } from "../../db";
import { created, serverError } from "../../helpers/http/routeResponses";
import { insertAttachment } from "../../helpers/repositories/attachmentsRepo";

export function buildAttachmentLocation(
  lat: unknown,
  long: unknown
): string | null {
  if (lat === undefined || lat === null || long === undefined || long === null) {
    return null;
  }
  return `${lat},${long}`;
}

type InsertAttachmentInput = {
  res: Response;
  url: unknown;
  pointId: unknown;
  attachmentId: unknown;
  taken_at: unknown;
  location: string | null;
};

function sendAttachmentInsertError(res: Response, err: unknown): void {
  serverError({
    res,
    logLabel: "Error creating attachment:",
    message: `Failed to create attachment: ${
      err instanceof Error ? err.message : String(err)
    }`,
    err,
  });
}

export async function insertAttachmentRow(
  input: InsertAttachmentInput
): Promise<void> {
  const { res, url, pointId, attachmentId, taken_at, location } = input;
  try {
    const result = await insertAttachment(pool, {
      url,
      pointId,
      attachmentId,
      taken_at,
      location,
      attachmentIdColumn: "attachmentid",
    });
    created({
      res,
      result: result.rows[0],
      message: "Attachment succesvol aangemaakt",
    });
  } catch (err) {
    sendAttachmentInsertError(res, err);
  }
}
