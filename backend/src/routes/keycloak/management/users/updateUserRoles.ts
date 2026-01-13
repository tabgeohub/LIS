import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase, getUserRoles } from "./helpers";
import { getAvailableRoles } from "./getAvailableRoles";
import { fetch } from "undici";

export async function updateUserRoles(
  userId: string,
  roles: string[],
  req: Request
): Promise<void> {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  // Get current roles
  const currentRoles = await getUserRoles(userId, adminToken, adminBase);

  // Get all available roles to find role IDs
  const availableRoles = await getAvailableRoles(req);

  // Collect all role IDs to add
  const rolesToAdd: Array<{ id: string; name: string }> = [];
  const rolesToRemove: Array<{ id: string; name: string }> = [];

  // Determine which roles to add and remove
  const currentRealmRoles = new Set(currentRoles.realmRoles);
  const newRealmRoles = new Set(
    roles.filter((role) =>
      availableRoles.realmRoles.some((r) => r.name === role)
    )
  );

  // Find realm roles to add
  availableRoles.realmRoles.forEach((role) => {
    if (newRealmRoles.has(role.name) && !currentRealmRoles.has(role.name)) {
      rolesToAdd.push(role);
    } else if (
      currentRealmRoles.has(role.name) &&
      !newRealmRoles.has(role.name)
    ) {
      rolesToRemove.push(role);
    }
  });

  // Remove roles first
  if (rolesToRemove.length > 0) {
    const realmRolesToRemove = rolesToRemove.filter((role) =>
      availableRoles.realmRoles.some((r) => r.id === role.id)
    );

    if (realmRolesToRemove.length > 0) {
      await fetch(`${adminBase}/users/${userId}/role-mappings/realm`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(realmRolesToRemove),
      });
    }
  }

  // Add new roles
  if (rolesToAdd.length > 0) {
    const realmRolesToAdd = rolesToAdd.filter((role) =>
      availableRoles.realmRoles.some((r) => r.id === role.id)
    );

    if (realmRolesToAdd.length > 0) {
      await fetch(`${adminBase}/users/${userId}/role-mappings/realm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(realmRolesToAdd),
      });
    }
  }
}

export async function handleUpdateUserRoles(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).json({ error: "Roles must be an array" });
    }

    await updateUserRoles(id, roles, req);
    res.json({ success: true });
  } catch (error: any) {
    const message = error?.message || "Failed to update user roles";
    return res.status(500).json({ error: message });
  }
}

