import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase, getUserRoles } from "./helpers";
import { getAvailableRoles } from "./getAvailableRoles";
import { computeRealmRoleDiff } from "./computeRealmRoleDiff";
import { syncRealmRoleMappings } from "./syncRealmRoleMappings";

export type UpdateUserRolesInput = {
  userId: string;
  roles: string[];
  req: Request;
};

export async function updateUserRoles(input: UpdateUserRolesInput): Promise<void> {
  const { userId, roles, req } = input;
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  const currentRoles = await getUserRoles({ userId, adminToken, adminBase });
  const availableRoles = await getAvailableRoles(req);

  const { toAdd, toRemove } = computeRealmRoleDiff({
    currentRealmRoleNames: currentRoles.realmRoles,
    requestedRoleNames: roles,
    availableRealmRoles: availableRoles.realmRoles,
  });

  await syncRealmRoleMappings({
    userId,
    adminToken,
    adminBase,
    availableRealmRoles: availableRoles.realmRoles,
    toAdd,
    toRemove,
  });
}

export async function handleUpdateUserRoles(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).json({ error: "Roles must be an array" });
    }

    await updateUserRoles({ userId: id, roles, req });
    res.json({ success: true });
  } catch (error: any) {
    const message = error?.message || "Failed to update user roles";
    return res.status(500).json({ error: message });
  }
}
