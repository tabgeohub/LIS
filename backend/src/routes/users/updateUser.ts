import { Request, Response } from "express";
import { pool } from "../../db";
import { hashPassword } from "../../helpers/passwordHash";

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { user_id, user_name, role, password } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const fields: string[] = [];
    const params: any[] = [];

    if (user_name !== undefined) {
      params.push(user_name);
      fields.push(`user_name = $${params.length}`);
    }
    if (role !== undefined) {
      params.push(role);
      fields.push(`role = $${params.length}`);
    }
    if (password !== undefined && String(password).length > 0) {
      const hashedPassword = await hashPassword(String(password));
      params.push(hashedPassword);
      fields.push(`password = $${params.length}`);
    }

    if (fields.length === 0) {
      res.status(400).json({ message: "No update fields provided" });
      return;
    }

    params.push(user_id);
    const result = await pool.query(
      `UPDATE lis.users
       SET ${fields.join(", ")}
       WHERE user_id = $${params.length}
       RETURNING *`,
      params
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
