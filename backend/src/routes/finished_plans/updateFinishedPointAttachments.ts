import { Request, Response } from "express";
import { pool } from "../../db";

export async function updateFinishedPointAttachments(
  req: Request,
  res: Response
): Promise<void> {
  const { point_id, plan_id, attachments_id } = req.body;

  if (!point_id || !plan_id || !attachments_id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `
      UPDATE lis.finished_plans SET
        attachments_id = $1
      WHERE point_id = $2 AND plan_id = $3
      RETURNING *;
    `,
      [attachments_id, point_id, plan_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        result: null,
        message: "Geen bestaande attachment gevonden.",
      });
      return;
    }

    res.status(200).json({
      result: result.rows[0],
      message: "Attachment succesvol bijgewerkt.",
    });
  } catch (err) {
    console.error(
      `Error updating point:`,
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to update point: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
