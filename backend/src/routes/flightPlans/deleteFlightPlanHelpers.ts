import type { Request, Response } from "express";
import { pool } from "../../db";
import { deleteFinishedFlightPlanCascade } from "../../helpers/queries/flight-plans/deleteFinishedFlightPlan";
import {
  deleteFlightPlanById,
  selectFlightPlanIdStatus,
} from "../../helpers/repositories/flightPlansRepo";
import type { PoolClient } from "pg";

export async function deleteSimpleFlightPlan(id: string, res: Response) {
  const result = await deleteFlightPlanById(pool, id);

  if (result.rowCount === 0) {
    res.status(404).json({ error: "Vluchtplan niet gevonden" });
    return;
  }

  res.status(200).json({
    message: "Vluchtplan succesvol verwijderd",
    deletedFlightPlan: result.rows[0],
  });
}

export async function deleteFinishedFlightPlan(id: string, res: Response) {
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

export async function deleteFlightPlanByStatus(
  id: string,
  res: Response
): Promise<void> {
  const flightPlanResult = await selectFlightPlanIdStatus(pool, id);

  if (flightPlanResult.rowCount === 0) {
    res.status(404).json({ error: "Vluchtplan niet gevonden" });
    return;
  }

  if (flightPlanResult.rows[0].status === "finished") {
    await deleteFinishedFlightPlan(id, res);
    return;
  }

  await deleteSimpleFlightPlan(id, res);
}

export function sendDeleteFlightPlanError(res: Response, err: unknown): void {
  console.error(
    "Fout bij het verwijderen van het vluchtplan:",
    err instanceof Error ? err.message : String(err)
  );
  res
    .status(500)
    .json({ error: err instanceof Error ? err.message : String(err) });
}

export function requireFlightPlanId(
  req: Request,
  res: Response
): string | null {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Ontbrekend vluchtplan-ID" });
    return null;
  }
  return id;
}
