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

export async function updateFinishedPointAttachments(
  req: Request,
  res: Response
): Promise<void> {
  const { point_id, plan_id, attachments_id } = req.body;

  if (
    point_id == null ||
    plan_id == null ||
    !requireArray(attachments_id)
  ) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
    return;
  }

  const newIds: number[] = attachments_id.map((id: unknown) => Number(id));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query<{
      attachments_id: number[] | null;
    }>(
      `
      SELECT attachments_id
      FROM lis.finished_plans
      WHERE point_id = $1 AND plan_id = $2
      FOR UPDATE
    `,
      [point_id, plan_id]
    );

    if (existing.rows.length === 0) {
      await client.query("ROLLBACK");
      notFound(res, "Geen bestaande attachment gevonden.");
      return;
    }

    const oldIds: number[] = existing.rows[0].attachments_id || [];
    const removed = oldIds.filter((id) => !newIds.includes(id));

    const result = await client.query(
      `
      UPDATE lis.finished_plans SET
        attachments_id = $1
      WHERE point_id = $2 AND plan_id = $3
      RETURNING *;
    `,
      [newIds, point_id, plan_id]
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

    await client.query("COMMIT");

    okResult({
      res,
      result: result.rows[0],
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
