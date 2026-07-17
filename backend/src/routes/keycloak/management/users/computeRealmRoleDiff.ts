export type RealmRoleRef = { id: string; name: string };

export function computeRealmRoleDiff(input: {
  currentRealmRoleNames: string[];
  requestedRoleNames: string[];
  availableRealmRoles: RealmRoleRef[];
}): { toAdd: RealmRoleRef[]; toRemove: RealmRoleRef[] } {
  const currentRealmRoles = new Set(input.currentRealmRoleNames);
  const newRealmRoles = new Set(
    input.requestedRoleNames.filter((role) =>
      input.availableRealmRoles.some((r) => r.name === role)
    )
  );

  const toAdd: RealmRoleRef[] = [];
  const toRemove: RealmRoleRef[] = [];

  for (const role of input.availableRealmRoles) {
    if (newRealmRoles.has(role.name) && !currentRealmRoles.has(role.name)) {
      toAdd.push(role);
    } else if (
      currentRealmRoles.has(role.name) &&
      !newRealmRoles.has(role.name)
    ) {
      toRemove.push(role);
    }
  }

  return { toAdd, toRemove };
}
