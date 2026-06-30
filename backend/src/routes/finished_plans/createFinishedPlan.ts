import { Request, Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";
import {
  rollbackFinishedPlanTransaction,
  saveFinishedPlanInTransaction,
} from "../../helpers/createFinishedPlanDb";
import {
  finishedPlanFail,
  finishedPlanOk,
  validateFinishedPlan,
} from "../../helpers/validators/finishedPlan";

async function connectDbClient(res: Response): Promise<PoolClient | null> {
  try {
    return await pool.connect();
  } catch (e) {
    finishedPlanFail(
      res,
      500,
      "ERR_DB_CONNECT",
      "Failed to acquire DB connection.",
      String(e)
    );
    return null;
  }
}

export async function createFinishedPlan(
  req: Request,
  res: Response
): Promise<void> {
  const validated = validateFinishedPlan(req.body);
  if (!validated.ok) {
    finishedPlanFail(res, 400, "ERR_VALIDATION", validated.reason);
    return;
  }

  const client = await connectDbClient(res);
  if (!client) {
    return;
  }

  try {
    await client.query("BEGIN");
    await saveFinishedPlanInTransaction(client, validated.plan);
    await client.query("COMMIT");
    finishedPlanOk(
      res,
      { message: "Vluchtplan succesvol opgeslagen", planId: validated.plan.id },
      200
    );
  } catch (e) {
    await rollbackFinishedPlanTransaction(client);
    const msg = e instanceof Error ? e.message : String(e);
    finishedPlanFail(
      res,
      500,
      "ERR_DB_TRANSACTION",
      "Failed to save finished plan.",
      msg
    );
  } finally {
    client.release();
  }
}
