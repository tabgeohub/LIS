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
    finishedPlanFail({
      res,
      status: 500,
      code: "ERR_DB_CONNECT",
      message: "Failed to acquire DB connection.",
      details: String(e),
    });
    return null;
  }
}

export async function createFinishedPlan(
  req: Request,
  res: Response
): Promise<void> {
  const validated = validateFinishedPlan(req.body);
  if (!validated.ok) {
    finishedPlanFail({
      res,
      status: 400,
      code: "ERR_VALIDATION",
      message: validated.reason,
    });
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
    finishedPlanOk({
      res,
      data: {
        message: "Vluchtplan succesvol opgeslagen",
        planId: validated.plan.id,
      },
    });
  } catch (e) {
    await rollbackFinishedPlanTransaction(client);
    const msg = e instanceof Error ? e.message : String(e);
    finishedPlanFail({
      res,
      status: 500,
      code: "ERR_DB_TRANSACTION",
      message: "Failed to save finished plan.",
      details: msg,
    });
  } finally {
    client.release();
  }
}
