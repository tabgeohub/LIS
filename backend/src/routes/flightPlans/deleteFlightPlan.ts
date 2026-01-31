import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";

export async function deleteFlightPlan(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Ontbrekend vluchtplan-ID" });
    return;
  }

  let client: PoolClient | null = null;

  try {
    // Get the flight plan to check its status
    const flightPlanResult = await pool.query(
      "SELECT id, status FROM lis.flightplans WHERE id = $1",
      [id]
    );

    if (flightPlanResult.rowCount === 0) {
      res.status(404).json({ error: "Vluchtplan niet gevonden" });
      return;
    }

    const flightPlan = flightPlanResult.rows[0];
    const isFinished = flightPlan.status === "finished";

    // Use transaction for cascade deletion if status is finished
    if (isFinished) {
      client = await pool.connect();

      try {
        await client.query("BEGIN");

        // 1. Collect all attachment IDs from finished_plans for this plan
        const finishedPlansResult = await client.query(
          `SELECT attachments_id FROM lis.finished_plans WHERE plan_id = $1`,
          [id]
        );

        // Flatten all attachment IDs from all finished_plans rows
        const allAttachmentIds: number[] = [];
        finishedPlansResult.rows.forEach((row: { attachments_id: number[] | null }) => {
          if (row.attachments_id && Array.isArray(row.attachments_id)) {
            allAttachmentIds.push(...row.attachments_id);
          }
        });

        // Remove duplicates
        const uniqueAttachmentIds = [...new Set(allAttachmentIds)];

        // 2. Delete attachments if any exist
        if (uniqueAttachmentIds.length > 0) {
          await client.query(
            `DELETE FROM lis.attachments WHERE id = ANY($1::int[])`,
            [uniqueAttachmentIds]
          );
        }

        // 3. Delete from finished_plans
        await client.query(`DELETE FROM lis.finished_plans WHERE plan_id = $1`, [
          id,
        ]);

        // 4. Delete from finished_plans_path
        const pathDeleteResult = await client.query(
          `DELETE FROM lis.finished_plans_path WHERE planid = $1`,
          [id]
        );

        // 5. Delete the flight plan
        const deleteResult = await client.query(
          `DELETE FROM lis.flightplans WHERE id = $1 RETURNING *`,
          [id]
        );

        await client.query("COMMIT");

        res.status(200).json({
          message: "Vluchtplan en gerelateerde data succesvol verwijderd",
          deletedFlightPlan: deleteResult.rows[0],
          cascadeDeleted: {
            attachments: uniqueAttachmentIds.length,
            finishedPlans: finishedPlansResult.rowCount || 0,
            finishedPlansPath: pathDeleteResult.rowCount || 0,
          },
        });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } else {
      // For non-finished plans, delete the flight plan
      const result = await pool.query(
        "DELETE FROM lis.flightplans WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Vluchtplan niet gevonden" });
        return;
      }

      res.status(200).json({
        message: "Vluchtplan succesvol verwijderd",
        deletedFlightPlan: result.rows[0],
      });
    }
  } catch (err) {
    console.error(
      "Fout bij het verwijderen van het vluchtplan:",
      err instanceof Error ? err.message : String(err)
    );
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}
