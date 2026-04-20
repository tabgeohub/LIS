import { Request, Response } from "express";
import { pool } from "../../db";
import {
  hashPassword,
  isHashedPassword,
  verifyPassword,
} from "../../helpers/passwordHash";

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ message: "Gebruikersnaam en wachtwoord zijn verplicht" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT user_id, user_name, role, password FROM lis.users WHERE LOWER(user_name) = LOWER($1)`,
      [username]
    );

    if (result.rows.length === 0) {
      res
        .status(401)
        .json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    const user = result.rows[0];

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      res
        .status(401)
        .json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    // Seamless migration for legacy plaintext passwords.
    if (!isHashedPassword(user.password)) {
      const hashed = await hashPassword(password);
      await pool.query("UPDATE lis.users SET password = $1 WHERE user_id = $2", [
        hashed,
        user.user_id,
      ]);
    }

    res.status(200).json({
      message: "Inloggen geslaagd",
      user: {
        id: user.user_id,
        username: user.user_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(
      "Error during login:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      message: `Internal server error: Error during login: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
