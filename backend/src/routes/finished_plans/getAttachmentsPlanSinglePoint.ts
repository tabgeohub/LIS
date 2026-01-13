import { Request, Response } from "express";
import { pool } from "../../db";

export async function getAttachmentsPlanSinglePoint(
  req: Request,
  res: Response
): Promise<void> {
  const { planId, pointId } = req.query;

  if (!planId || !pointId) {
    res.status(400).json({
      message: "Missing planId or pointId parameter",
    });
    return;
  }

  try {
    // First, get the finished_plans entry to get the attachments_id array
    const finishedPlanResult = await pool.query(
      `
      SELECT attachments_id
      FROM lis.finished_plans
      WHERE plan_id = $1 AND point_id = $2
      LIMIT 1;
      `,
      [parseInt(planId as string, 10), parseInt(pointId as string, 10)]
    );

    if (finishedPlanResult.rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    const attachmentsId = finishedPlanResult.rows[0].attachments_id;

    if (
      !attachmentsId ||
      !Array.isArray(attachmentsId) ||
      attachmentsId.length === 0
    ) {
      res.status(200).json([]);
      return;
    }

    // Get the attachments
    const attachmentsResult = await pool.query(
      `
      SELECT *
      FROM lis.attachments
      WHERE id = ANY($1::int[])
      ORDER BY taken_at ASC;
      `,
      [attachmentsId]
    );

    res.status(200).json(attachmentsResult.rows);
  } catch (err) {
    console.error(
      "Error fetching attachments for plan single point:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      message: `Failed to fetch attachments. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
