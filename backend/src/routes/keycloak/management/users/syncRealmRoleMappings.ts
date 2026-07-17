import { fetch } from "undici";
import type { RealmRoleRef } from "./computeRealmRoleDiff";

export async function syncRealmRoleMappings(input: {
  userId: string;
  adminToken: string;
  adminBase: string;
  availableRealmRoles: RealmRoleRef[];
  toAdd: RealmRoleRef[];
  toRemove: RealmRoleRef[];
}): Promise<void> {
  const {
    userId,
    adminToken,
    adminBase,
    availableRealmRoles,
    toAdd,
    toRemove,
  } = input;

  if (toRemove.length > 0) {
    const realmRolesToRemove = toRemove.filter((role) =>
      availableRealmRoles.some((r) => r.id === role.id)
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

  if (toAdd.length > 0) {
    const realmRolesToAdd = toAdd.filter((role) =>
      availableRealmRoles.some((r) => r.id === role.id)
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
