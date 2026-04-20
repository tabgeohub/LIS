import { Request, Response } from "express";
import { pool } from "../../db";

export async function createUser(req: Request, res: Response) {
  const { user_name, password, role } = req.body;

  if (!user_name || !role || !password) {
    res
      .status(400)
      .json({ error: "Ontbrekende gebruikersnaam, rol of wachtwoord" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO lis.users (user_name, role, password) VALUES ($1, $2, $3) RETURNING *",
      [user_name, role, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(
      "Error creating user:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
