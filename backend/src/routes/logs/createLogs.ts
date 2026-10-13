import { Request, Response } from "express";
import type { Pool } from "pg";
import { writeLogBatch } from "./logBatchWriter";
import {
  logsFailureMessage,
} from "../../helpers/queries/logs/logFields";

export function makeCreateLogs(db: Pick<Pool, "connect">) {
 return async function handler(req: Request, res: Response): Promise<void> {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.some(log => !log || typeof log !== "object" || Array.isArray(log))) { res.status(400).json({ message: "Invalid logs" }); return; }
    const newFlightId = await writeLogBatch(db, logs);
    res.status(201).json({ message: "Logs created successfully", flight_id: newFlightId, record_count: logs.length });
  } catch (err) {
    res.status(500).json({
      result: null,
      message: logsFailureMessage(err),
    });
  }
 };
}
export async function createLogs(req: Request, res: Response): Promise<void> {
  return makeCreateLogs(require("../../db").pool)(req, res);
}
