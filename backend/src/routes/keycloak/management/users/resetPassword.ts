import { Request, Response } from "express";
import { handleKeycloakRouteError } from "./keycloakAdminClient";
import {
  putKeycloakResetPassword,
  throwIfResetPasswordFailed,
  validateResetPasswordInput,
} from "./resetPasswordHelpers";

export async function handleResetPassword(req: Request, res: Response) {
  try {
    const input = validateResetPasswordInput(req, res);
    if (!input) return;

    const response = await putKeycloakResetPassword(req, input);
    await throwIfResetPasswordFailed(response);
    res.json({ success: true });
  } catch (error: unknown) {
    handleKeycloakRouteError({
      res,
      error,
      fallbackMessage: "Failed to reset password",
    });
  }
}
