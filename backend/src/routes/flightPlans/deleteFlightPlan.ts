import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";
import { deleteFinishedFlightPlanCascade } from "../../helpers/queries/flight-plans/deleteFinishedFlightPlan";

async function deleteSimpleFlightPlan(id: string, res: Response) {
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

async function deleteFinishedFlightPlan(id: string, res: Response) {
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const summary = await deleteFinishedFlightPlanCascade(client, id);

    await client.query("COMMIT");
    res.status(200).json({
      message: "Vluchtplan en gerelateerde data succesvol verwijderd",
      deletedFlightPlan: summary.deletedFlightPlan,
      cascadeDeleted: summary.cascadeDeleted,
    });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    throw err;
  } finally {
    client?.release();
  }
}

export async function deleteFlightPlan(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Ontbrekend vluchtplan-ID" });
    return;
  }

  try {
    const flightPlanResult = await pool.query(
      "SELECT id, status FROM lis.flightplans WHERE id = $1",
      [id]
    );

    if (flightPlanResult.rowCount === 0) {
      res.status(404).json({ error: "Vluchtplan niet gevonden" });
      return;
    }

    const isFinished = flightPlanResult.rows[0].status === "finished";
    if (isFinished) {
      await deleteFinishedFlightPlan(id, res);
      return;
    }

    await deleteSimpleFlightPlan(id, res);
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
