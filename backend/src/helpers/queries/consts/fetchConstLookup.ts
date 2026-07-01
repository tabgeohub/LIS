import { Response } from "express";
import { pool } from "../../../db";

export type FetchConstLookupInput = {
  res: Response;
  select: string;
  from: string;
  where?: string;
  orderBy?: string;
  errorLabel: string;
  useErrorField?: boolean;
};

export async function fetchConstLookup(
  input: FetchConstLookupInput
): Promise<void> {
  const { res, select, from, where, orderBy, errorLabel, useErrorField = false } =
    input;

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
