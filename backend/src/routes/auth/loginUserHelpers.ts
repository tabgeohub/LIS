import { timingSafeEqual } from "crypto";
import type { Response } from "express";
import { pool } from "../../db";

function secretsEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export type AuthenticatedUser = {
  id: number;
  username: string;
  role: string;
};

export async function authenticateUser(
  username: string,
  password: string
): Promise<AuthenticatedUser | null> {
  const result = await pool.query(
    `SELECT user_id, user_name, role, password FROM lis.users WHERE LOWER(user_name) = LOWER($1)`,
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  if (!secretsEqual(password, user.password)) {
    return null;
  }

  return {
    id: user.user_id,
    username: user.user_name,
    role: user.role,
  };
}

export function sendLoginError(res: Response, err: unknown): void {
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
