import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildLogInsertQuery,
  buildLogInsertValues,
  logsFailureMessage,
} from "../../helpers/queries/logFields";

export async function createLogs(req: Request, res: Response): Promise<void> {
  try {
    const { logs } = req.body;

    const result = await pool.query("SELECT MAX(flight_id) FROM lis.logging");
    const maxFlightId = result.rows[0].max || 0;
    const newFlightId = maxFlightId + 1;
    const insertQuery = buildLogInsertQuery();

    for (const log of logs) {
      await pool.query(insertQuery, buildLogInsertValues(newFlightId, log));
    }

    res.status(201).json({ message: "Logs created successfully" });
  } catch (err) {
    res.status(500).json({
      result: null,
      message: logsFailureMessage(err),
    });
  }
}
