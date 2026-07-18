import type { Response } from "express";
import type { PoolClient } from "pg";
import { pool } from "../../db";
import {
  rollbackFinishedPlanTransaction,
  saveFinishedPlanInTransaction,
} from "../../helpers/finished-plans/createFinishedPlanDb";
import {
  finishedPlanFail,
  finishedPlanOk,
} from "../../helpers/validators/finishedPlan";
import type { IncomingPlan } from "../../helpers/validators/finishedPlan";

export async function connectFinishedPlanClient(
  res: Response
): Promise<PoolClient | null> {
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

function failFinishedPlanSave(res: Response, e: unknown): void {
  finishedPlanFail({
    res,
    status: 500,
    code: "ERR_DB_TRANSACTION",
    message: "Failed to save finished plan.",
    details: e instanceof Error ? e.message : String(e),
  });
}

export async function saveFinishedPlanWithClient(input: {
  client: PoolClient;
  res: Response;
  plan: IncomingPlan;
}): Promise<void> {
  const { client, res, plan } = input;
  try {
    await client.query("BEGIN");
    await saveFinishedPlanInTransaction(client, plan);
    await client.query("COMMIT");
    finishedPlanOk({
      res,
      data: {
        message: "Vluchtplan succesvol opgeslagen",
        planId: plan.id,
      },
    });
  } catch (e) {
    await rollbackFinishedPlanTransaction(client);
    failFinishedPlanSave(res, e);
  } finally {
    client.release();
  }
}
