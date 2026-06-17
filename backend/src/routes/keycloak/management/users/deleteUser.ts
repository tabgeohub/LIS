import { Request, Response } from "express";
import {
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

export async function handleDeleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const response = await keycloakAdminFetch(req, `/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const text = await response.text();

      if (response.status === 403) {
        throw new Error(
          "Service account lacks permission to delete users. " +
            "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned."
        );
      }

      if (response.status === 404) {
        throw new Error("User not found");
      }

      throw new Error(`Failed to delete user (${response.status}): ${text}`);
    }

    res.json({ success: true });
  } catch (error: unknown) {
    handleKeycloakRouteError(res, error, "Failed to delete user");
  }
}
