import { Request } from "express";
import { fetch } from "undici";
import {
  getKeycloakAdminBase,
  getKeycloakAdminToken,
} from "../../../services/getKeycloakAdminToken";

export function getAdminBase(req: Request): string {
  return getKeycloakAdminBase(req);
}

export async function getKeycloakAdminContext(req: Request) {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  return { adminToken, adminBase };
}

export async function keycloakAdminFetch(
  req: Request,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const { adminToken, adminBase } = await getKeycloakAdminContext(req);

  return fetch(`${adminBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export async function fetchKeycloakClients(
  adminToken: string,
  adminBase: string
): Promise<Array<{ id: string; clientId: string }>> {
  const clientsResponse = await fetch(`${adminBase}/clients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!clientsResponse.ok) {
    return [];
  }

  return (await clientsResponse.json()) as Array<{ id: string; clientId: string }>;
}

export async function fetchClientRoleNamesForUser(
  userId: string,
  adminToken: string,
  adminBase: string
): Promise<Record<string, string[]>> {
  const clientRoles: Record<string, string[]> = {};
  const clients = await fetchKeycloakClients(adminToken, adminBase);

  for (const client of clients) {
    try {
      const clientRolesResponse = await fetch(
        `${adminBase}/users/${userId}/role-mappings/clients/${client.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (clientRolesResponse.ok) {
        const clientRolesData = (await clientRolesResponse.json()) as Array<{
          name: string;
        }>;
        if (clientRolesData.length > 0) {
          clientRoles[client.clientId] = clientRolesData.map((role) => role.name);
        }
      }
    } catch (error) {
      console.warn(
        `Failed to fetch client roles for user ${userId} and client ${client.clientId}:`,
        error
      );
    }
  }

  return clientRoles;
}

export async function fetchClientRoleDefinitions(
  adminToken: string,
  adminBase: string
): Promise<Record<string, Array<{ id: string; name: string }>>> {
  const clientRoles: Record<string, Array<{ id: string; name: string }>> = {};
  const clients = await fetchKeycloakClients(adminToken, adminBase);

  for (const client of clients) {
    try {
      const rolesResponse = await fetch(
        `${adminBase}/clients/${client.id}/roles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (rolesResponse.ok) {
        const roles = (await rolesResponse.json()) as Array<{
          id: string;
          name: string;
        }>;
        if (roles.length > 0) {
          clientRoles[client.clientId] = roles;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch roles for client ${client.clientId}:`, error);
    }
  }

  return clientRoles;
}

export function handleKeycloakRouteError(
  res: import("express").Response,
  error: unknown,
  fallbackMessage: string
) {
  const message =
    error instanceof Error ? error.message : fallbackMessage;
  return res.status(500).json({ error: message });
}
