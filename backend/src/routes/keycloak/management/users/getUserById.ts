import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase, getUserRoles } from "./helpers";
import { KeycloakUser } from "./types";
import { fetch } from "undici";

async function getUserById(
  userId: string,
  req: Request
): Promise<KeycloakUser> {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  const response = await fetch(`${adminBase}/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch user: ${text}`);
  }

  const user = (await response.json()) as KeycloakUser;
  const roles = await getUserRoles(userId, adminToken, adminBase);

  return {
    ...user,
    realmRoles: roles.realmRoles,
    clientRoles: roles.clientRoles,
  };
}

export async function handleGetUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await getUserById(id, req);
    res.json(user);
  } catch (error: any) {
    const message = error?.message || "Failed to fetch user";
    return res.status(500).json({ error: message });
  }
}

