import type { Response } from "express";
import { pool } from "../../db";
import { created, serverError } from "../../helpers/http/routeResponses";

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
    const result = await pool.query(
      `INSERT INTO lis.attachments (url, point_id, attachmentid, taken_at, location) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [url, pointId, attachmentId, taken_at, location]
    );
    created({
      res,
      result: result.rows[0],
      message: "Attachment succesvol aangemaakt",
    });
  } catch (err) {
    sendAttachmentInsertError(res, err);
  }
}
