import { Request, Response } from "express";
import { pool } from "../../db";

export async function createLogs(req: Request, res: Response): Promise<void> {
  try {
    const { logs } = req.body;

    const result = await pool.query("SELECT MAX(flight_id) FROM lis.logging");
    const maxFlightId = result.rows[0].max || 0;

    const newFlightId = maxFlightId + 1;

    for (let log of logs) {
      const {
        message,
        userId,
        userName,
        userRole,
        planId,
        pointId,
        date,
        isOnline,
        gpsConnected,
        oldData,
        newData,
        currentLocation,
      } = log;

      const query = `
        INSERT INTO lis.logging (
          flight_id,
          message,
          userid,
          userName,
          userRole,
          planId,
          pointId,
          date,
          isOnline,
          gpsConnected,
          oldData,
          newData,
          currentLocation
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id;
      `;

      const values = [
        newFlightId,
        message || "",
        userId || "",
        userName || "",
        userRole || "",
        planId || 0,
        pointId || 0,
        date || "",
        isOnline || false,
        gpsConnected || false,
        JSON.stringify(oldData),
        JSON.stringify(newData),
        JSON.stringify(currentLocation),
      ];

      await pool.query(query, values);
    }

    res.status(201).json({ message: "Logs created successfully" });
  } catch (err) {
    res.status(500).json({
      result: null,
      message: `Failed to create logs: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
