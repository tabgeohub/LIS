import { getKeycloakAdminBase } from "../../../../services/getKeycloakAdminToken";
import { fetch } from "undici";

export function getAdminBase(req: any): string {
  return getKeycloakAdminBase(req);
}

export async function getUserRoles(
  userId: string,
  adminToken: string,
  adminBase: string
): Promise<{ realmRoles: string[]; clientRoles: Record<string, string[]> }> {
  const realmRoles: string[] = [];
  const clientRoles: Record<string, string[]> = {};

  try {
    // Fetch realm roles
    const realmResponse = await fetch(
      `${adminBase}/users/${userId}/role-mappings/realm`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (realmResponse.ok) {
      const realmRolesData = (await realmResponse.json()) as Array<{
        name: string;
      }>;
      realmRoles.push(...realmRolesData.map((role) => role.name));
    }
  } catch (error) {
    console.warn(`Failed to fetch realm roles for user ${userId}:`, error);
  }

  try {
    // Fetch client roles - first get all clients
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

      // Fetch roles for each client
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
            const clientRolesData =
              (await clientRolesResponse.json()) as Array<{
                name: string;
              }>;
            if (clientRolesData.length > 0) {
              clientRoles[client.clientId] = clientRolesData.map(
                (role) => role.name
              );
            }
          }
        } catch (error) {
          console.warn(
            `Failed to fetch client roles for user ${userId} and client ${client.clientId}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch client roles for user ${userId}:`, error);
  }

  return { realmRoles, clientRoles };
}

