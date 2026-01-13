import { Request, Response } from "express";
import { pool } from "../../db";

export async function createAttachment(
  req: Request,
  res: Response
): Promise<void> {
  const { url, pointId, attachmentId, taken_at } = req.body;

  if (!pointId || !attachmentId || !taken_at || !url) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO lis.attachments (url, point_id, attachmentid, taken_at) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [url, pointId, attachmentId, taken_at]
    );

    res.status(201).json({
      result: result.rows[0],
      message: "Attachment succesvol aangemaakt",
    });
  } catch (err) {
    console.error(
      "Error creating attachment:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to create attachment: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
