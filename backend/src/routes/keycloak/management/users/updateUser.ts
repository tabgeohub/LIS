import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase } from "./helpers";
import { fetch } from "undici";

async function updateUser(
  userId: string,
  updates: {
    username?: string;
    email?: string;
  },
  req: Request
): Promise<void> {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  const response = await fetch(`${adminBase}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update user: ${text}`);
  }
}

export async function handleUpdateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    await updateUser(id, { username, email }, req);
    res.json({ success: true });
  } catch (error: any) {
    const message = error?.message || "Failed to update user";
    return res.status(500).json({ error: message });
  }
}

