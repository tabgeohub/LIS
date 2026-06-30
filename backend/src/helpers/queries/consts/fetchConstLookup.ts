import { Request, Response } from "express";
import { pool } from "../../../db";

type FetchConstLookupOptions = {
  select: string;
  from: string;
  where?: string;
  orderBy?: string;
  errorLabel: string;
  useErrorField?: boolean;
};

export async function fetchConstLookup(
  _req: Request,
  res: Response,
  options: FetchConstLookupOptions
): Promise<void> {
  const { select, from, where, orderBy, errorLabel, useErrorField = false } =
    options;

  try {
    const whereClause = where ? ` WHERE ${where}` : "";
    const orderClause = orderBy ? ` ORDER BY ${orderBy}` : "";
    const result = await pool.query(
      `SELECT ${select} FROM ${from}${whereClause}${orderClause}`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`❌ Error fetching ${errorLabel}:`, error);
    const message = `Failed to fetch ${errorLabel}`;

    if (useErrorField) {
      res.status(500).json({
        error: `${message}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
      return;
    }

    res.status(500).json({ message });
  }
}
