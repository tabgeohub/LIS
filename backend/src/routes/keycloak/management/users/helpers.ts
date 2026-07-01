import { fetch } from "undici";
import {
  fetchClientRoleNamesForUser,
  getAdminBase,
  getKeycloakAdminContext,
} from "./keycloakAdminClient";

export { getAdminBase };

export type GetUserRolesInput = {
  userId: string;
  adminToken: string;
  adminBase: string;
};

export async function getUserRoles(
  input: GetUserRolesInput
): Promise<{ realmRoles: string[]; clientRoles: Record<string, string[]> }> {
  const { userId, adminToken, adminBase } = input;
  const realmRoles: string[] = [];

  try {
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

  const clientRoles = await fetchClientRoleNamesForUser({
    userId,
    adminToken,
    adminBase,
  });

  return { realmRoles, clientRoles };
}

export async function getUserRolesForRequest(userId: string, req: import("express").Request) {
  const { adminToken, adminBase } = await getKeycloakAdminContext(req);
  return getUserRoles({ userId, adminToken, adminBase });
}
