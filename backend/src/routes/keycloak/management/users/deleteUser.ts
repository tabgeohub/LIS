import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase } from "./helpers";
import { fetch } from "undici";

export async function handleDeleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const adminToken = await getKeycloakAdminToken(req);
    const adminBase = getAdminBase(req);

    const response = await fetch(`${adminBase}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
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
  } catch (error: any) {
    const message = error?.message || "Failed to delete user";
    return res.status(500).json({ error: message });
  }
}

