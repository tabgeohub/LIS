import { Request, Response } from "express";
import { pool } from "../../db";
import {
  respondMissingUserId,
  respondUserUpdateError,
  respondUserUpdateResult,
  runUpdateUserQuery,
} from "./updateUserHelpers";

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { user_id, user_name, role, password } = req.body;

  if (!user_id) {
    respondMissingUserId(res);
    return;
  }

  try {
    const result = await runUpdateUserQuery(pool, {
      user_id,
      user_name,
      role,
      password,
    });
    respondUserUpdateResult(res, result);
  } catch (err) {
    respondUserUpdateError(res, err);
  }
}
