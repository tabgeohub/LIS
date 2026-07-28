import type { Response } from "express";
import type { QueryResult } from "pg";
import type { Queryable } from "../../helpers/repositories/queryable";
import { updateUserReturning } from "../../helpers/repositories/usersRepo";

export function respondMissingUserId(res: Response): boolean {
  res.status(400).json({ message: "User ID is required" });
  return true;
}

export function respondUserUpdateResult(
  res: Response,
  result: QueryResult
): void {
  if (result.rowCount === 0) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json({
    message: "User updated successfully",
    user: result.rows[0],
  });
}

export function respondUserUpdateError(res: Response, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Error updating user:", message);
  res.status(500).json({ message: `Error updating user: ${message}` });
}

export async function runUpdateUserQuery(
  pool: Queryable,
  body: {
    user_id: unknown;
    user_name: unknown;
    role: unknown;
    password: unknown;
  }
) {
  return updateUserReturning(pool, body);
}
