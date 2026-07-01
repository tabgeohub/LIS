import { Request, Response } from "express";
import { pool } from "../../db";
import { created, missingFields, serverError } from "../../helpers/routeResponses";
import { getMissingFields } from "../../helpers/validateBody";

export async function createAttachment(
  req: Request,
  res: Response
): Promise<void> {
  const { url, pointId, attachmentId, taken_at, long, lat } = req.body;

  if (
    getMissingFields(req.body, ["pointId", "attachmentId", "taken_at", "url"])
      .length > 0
  ) {
    missingFields(res);
    return;
  }

  let location: string | null = null;
  if (lat !== undefined && lat !== null && long !== undefined && long !== null) {
    location = `${lat},${long}`;
  }

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
    serverError({
      res,
      logLabel: "Error creating attachment:",
      message: `Failed to create attachment: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
