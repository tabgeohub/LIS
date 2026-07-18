import { fetch } from "undici";

export async function fetchRoleNamesForOneClient(input: {
  userId: string;
  adminToken: string;
  adminBase: string;
  client: { id: string; clientId: string };
}): Promise<string[] | null> {
  try {
    const clientRolesResponse = await fetch(
      `${input.adminBase}/users/${input.userId}/role-mappings/clients/${input.client.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${input.adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!clientRolesResponse.ok) return null;
    const clientRolesData = (await clientRolesResponse.json()) as Array<{
      name: string;
    }>;
    if (clientRolesData.length === 0) return null;
    return clientRolesData.map((role) => role.name);
  } catch (error) {
    console.warn(
      `Failed to fetch client roles for user ${input.userId} and client ${input.client.clientId}:`,
      error
    );
    return null;
  }
}
