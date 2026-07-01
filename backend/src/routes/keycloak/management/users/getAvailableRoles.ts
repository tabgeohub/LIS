import { Request, Response } from "express";
import {
  fetchClientRoleDefinitions,
  getKeycloakAdminContext,
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

export async function getAvailableRoles(req: Request): Promise<{
  realmRoles: Array<{ id: string; name: string }>;
  clientRoles: Record<string, Array<{ id: string; name: string }>>;
}> {
  const realmRoles: Array<{ id: string; name: string }> = [];
  const { adminToken, adminBase } = await getKeycloakAdminContext(req);

  try {
    const realmResponse = await keycloakAdminFetch(req, "/roles", {
      method: "GET",
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

  const clientRoles = await fetchClientRoleDefinitions(adminToken, adminBase);

  return { realmRoles, clientRoles };
}

export async function handleGetAvailableRoles(req: Request, res: Response) {
  try {
    const roles = await getAvailableRoles(req);
    res.json(roles);
  } catch (error: unknown) {
    handleKeycloakRouteError({ res, error, fallbackMessage: "Failed to fetch roles" });
  }
}
