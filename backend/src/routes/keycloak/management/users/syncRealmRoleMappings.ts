import { fetch } from "undici";
import type { RealmRoleRef } from "./computeRealmRoleDiff";

async function postRealmRoleMappingChange(input: {
  userId: string;
  adminToken: string;
  adminBase: string;
  method: "DELETE" | "POST";
  roles: RealmRoleRef[];
}): Promise<void> {
  if (input.roles.length === 0) return;
  await fetch(`${input.adminBase}/users/${input.userId}/role-mappings/realm`, {
    method: input.method,
    headers: {
      Authorization: `Bearer ${input.adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input.roles),
  });
}

function filterAvailableRoles(
  roles: RealmRoleRef[],
  availableRealmRoles: RealmRoleRef[]
): RealmRoleRef[] {
  return roles.filter((role) =>
    availableRealmRoles.some((r) => r.id === role.id)
  );
}

export async function syncRealmRoleMappings(input: {
  userId: string;
  adminToken: string;
  adminBase: string;
  availableRealmRoles: RealmRoleRef[];
  toAdd: RealmRoleRef[];
  toRemove: RealmRoleRef[];
}): Promise<void> {
  const shared = {
    userId: input.userId,
    adminToken: input.adminToken,
    adminBase: input.adminBase,
  };
  await postRealmRoleMappingChange({
    ...shared,
    method: "DELETE",
    roles: filterAvailableRoles(input.toRemove, input.availableRealmRoles),
  });
  await postRealmRoleMappingChange({
    ...shared,
    method: "POST",
    roles: filterAvailableRoles(input.toAdd, input.availableRealmRoles),
  });
}
