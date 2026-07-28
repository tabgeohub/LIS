import { Request, Response } from "express";
import { pool } from "../../db";
import { insertUserReturning } from "../../helpers/repositories/usersRepo";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function hasRequiredUserFields(body: {
  user_name?: unknown;
  password?: unknown;
  role?: unknown;
}): boolean {
  return Boolean(body.user_name && body.role && body.password);
}

export async function createUser(req: Request, res: Response) {
  if (!hasRequiredUserFields(req.body)) {
    res
      .status(400)
      .json({ error: "Ontbrekende gebruikersnaam, rol of wachtwoord" });
    return;
  }

  const { user_name, password, role } = req.body;

  try {
    const result = await insertUserReturning(pool, {
      user_name,
      role,
      password,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    const message = errorMessage(err);
    console.error("Error creating user:", message);
    res.status(500).json({ error: `Error: ${message}` });
  }
}
