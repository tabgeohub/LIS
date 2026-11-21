import { Request, Response } from "express";
import { pool } from "../../db";
import {
  isAdminRegioValue,
  resolveRegioFilter,
} from "../../helpers/queries/shared/resolveRegioFilter";

export async function getAllWaarnemers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regioFilter = resolveRegioFilter(req);
    const params: string[] = [];
    let where = "";

    if (regioFilter && !isAdminRegioValue(regioFilter)) {
      params.push(regioFilter);
      where = ` WHERE regio_id = $1`;
    }

    const result = await pool.query(
      `SELECT id, naam, regio_id FROM lis.waarnemers${where} ORDER BY naam ASC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    res.status(500).json({
      error: `Error getting all waarnemers: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
