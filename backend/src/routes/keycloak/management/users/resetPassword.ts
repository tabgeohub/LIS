import { Request, Response } from "express";
import { getAdminBase } from "./helpers";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { fetch } from "undici";

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

    const adminToken = await getKeycloakAdminToken(req);
    const adminBase = getAdminBase(req);

    const response = await fetch(`${adminBase}/users/${id}/reset-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "password",
        value: password,
        temporary: temporary,
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
  } catch (error: any) {
    const message = error?.message || "Failed to reset password";
    return res.status(500).json({ error: message });
  }
}

