import { Request, Response } from "express";
import { pool } from "../../db";
import { buildGeometriesListQuery } from "./buildGeometriesListQuery";

function formatGeometriesError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function getGeometries(req: Request, res: Response): Promise<void> {
  try {
    const { query, params } = buildGeometriesListQuery(req);
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(formatGeometriesError(err));
    res.status(500).json({ error: `Error: ${formatGeometriesError(err)}` });
  }
}
