import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase } from "./helpers";
import { fetch } from "undici";

export async function getAvailableRoles(req: Request): Promise<{
  realmRoles: Array<{ id: string; name: string }>;
  clientRoles: Record<string, Array<{ id: string; name: string }>>;
}> {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);
  const realmRoles: Array<{ id: string; name: string }> = [];
  const clientRoles: Record<string, Array<{ id: string; name: string }>> = {};

  try {
    // Fetch realm roles
    const realmResponse = await fetch(`${adminBase}/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });

    if (realmResponse.ok) {
      const roles = (await realmResponse.json()) as Array<{
        id: string;
        name: string;
      }>;
      realmRoles.push(...roles);
    }
  } catch (error) {
    console.warn("Failed to fetch realm roles:", error);
  }

  try {
    // Fetch client roles
    const clientsResponse = await fetch(`${adminBase}/clients`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });

    if (clientsResponse.ok) {
      const clients = (await clientsResponse.json()) as Array<{
        id: string;
        clientId: string;
      }>;

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
          console.warn(
            `Failed to fetch roles for client ${client.clientId}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.warn("Failed to fetch client roles:", error);
  }

  return { realmRoles, clientRoles };
}

export async function handleGetAvailableRoles(req: Request, res: Response) {
  try {
    const roles = await getAvailableRoles(req);
    res.json(roles);
  } catch (error: any) {
    const message = error?.message || "Failed to fetch roles";
    return res.status(500).json({ error: message });
  }
}

