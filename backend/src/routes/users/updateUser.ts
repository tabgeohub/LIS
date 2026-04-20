import { Request, Response } from "express";
import { pool } from "../../db";

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { user_id, user_name, role, password } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE lis.users
       SET user_name = $1,
           role = $2,
           password = $3
       WHERE user_id = $4
       RETURNING *`,
      [user_name, role, password, user_id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(
      "Error updating user:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      message: `Error updating user: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
