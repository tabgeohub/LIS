import { Request, Response } from "express";
import { pool } from "../../db";
import { created, missingFields, serverError } from "../../helpers/routeResponses";
import { getMissingFields } from "../../helpers/validateBody";

export async function createEmail(req: Request, res: Response): Promise<void> {
  const { email, regio } = req.body;

  if (getMissingFields(req.body, ["email"]).length > 0) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO lis.emails (email, regio_id) VALUES ($1, $2) RETURNING *;`,
      [email, regio]
    );

    created(res, result.rows[0], "E-mail succesvol aangemaakt");
  } catch (err) {
    serverError(
      res,
      "Error creating email:",
      `Failed to create email: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
