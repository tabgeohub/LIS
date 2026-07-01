import { Request, Response } from "express";
import { KeycloakUser } from "./types";
import { getUserRoles } from "./helpers";
import {
  getKeycloakAdminContext,
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

async function getUserById(
  userId: string,
  req: Request
): Promise<KeycloakUser> {
  const response = await keycloakAdminFetch(req, `/users/${userId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch user: ${text}`);
  }

  const user = (await response.json()) as KeycloakUser;
  const { adminToken, adminBase } = await getKeycloakAdminContext(req);
  const roles = await getUserRoles({ userId, adminToken, adminBase });

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
  } catch (error: unknown) {
    handleKeycloakRouteError({ res, error, fallbackMessage: "Failed to fetch user" });
  }
}
