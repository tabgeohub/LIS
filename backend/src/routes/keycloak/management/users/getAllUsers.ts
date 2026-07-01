import { Request, Response } from "express";
import { KeycloakUser } from "./types";
import { getUserRoles } from "./helpers";
import {
  getKeycloakAdminContext,
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

async function getAllUsers(req: Request): Promise<KeycloakUser[]> {
  const response = await keycloakAdminFetch(req, "/users", { method: "GET" });

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
  const { adminToken, adminBase } = await getKeycloakAdminContext(req);

  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      const roles = await getUserRoles({ userId: user.id, adminToken, adminBase });
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
  } catch (error: unknown) {
    handleKeycloakRouteError({ res, error, fallbackMessage: "Failed to fetch users" });
  }
}
