import { Request, Response } from "express";
import { pool } from "../../db";
import { selectAllUsers } from "../../helpers/repositories/usersRepo";

export async function getUsers(req: Request, res: Response) {
  try {
    const result = await selectAllUsers(pool);

    res.json(result.rows);
  } catch (err) {
    console.error(
      `Error fetching users: ${
        err instanceof Error ? err.message : String(err)
      }`
    );

    res.status(500).json({
      error: `Error fetching users: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
