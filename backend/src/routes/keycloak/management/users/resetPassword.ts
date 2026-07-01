import { Request, Response } from "express";
import {
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

export async function handleResetPassword(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { password, temporary = false } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const response = await keycloakAdminFetch(req, `/users/${id}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({
        type: "password",
        value: password,
        temporary,
      }),
    });

    if (!response.ok) {
      const text = await response.text();

      if (response.status === 403) {
        throw new Error(
          "Service account lacks permission to reset user passwords. " +
            "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned."
        );
      }

      if (response.status === 404) {
        throw new Error("User not found");
      }

      throw new Error(`Failed to reset password (${response.status}): ${text}`);
    }

    res.json({ success: true });
  } catch (error: unknown) {
    handleKeycloakRouteError({ res, error, fallbackMessage: "Failed to reset password" });
  }
}
