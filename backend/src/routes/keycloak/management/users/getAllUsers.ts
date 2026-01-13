import { Request, Response } from "express";
import { getAdminBase, getUserRoles } from "./helpers";
import { KeycloakUser } from "./types";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { fetch } from "undici";

async function getAllUsers(req: Request): Promise<KeycloakUser[]> {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  const response = await fetch(`${adminBase}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();

    if (response.status === 403) {
      throw new Error(
        "Service account lacks permission to view users. " +
          "Ensure the service account has the 'view-users' role from the 'realm-management' client assigned. " +
          "Go to: Clients → Your Client → Service account roles → Assign role → Filter by 'realm-management' → Select 'view-users'"
      );
    }

    throw new Error(`Failed to fetch users (${response.status}): ${text}`);
  }

  const users = (await response.json()) as KeycloakUser[];

  // Fetch roles for all users in parallel
  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      const roles = await getUserRoles(user.id, adminToken, adminBase);
      return {
        ...user,
        realmRoles: roles.realmRoles,
        clientRoles: roles.clientRoles,
      };
    })
  );

  return usersWithRoles;
}

export async function handleGetAllUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers(req);
    res.json(users);
  } catch (error: any) {
    const message = error?.message || "Failed to fetch users";
    return res.status(500).json({ error: message });
  }
}

