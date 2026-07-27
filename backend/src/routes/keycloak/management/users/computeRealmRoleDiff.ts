export type RealmRoleRef = { id: string; name: string };

function buildRequestedRoleSet(
  requestedRoleNames: string[],
  availableRealmRoles: RealmRoleRef[]
): Set<string> {
  const availableNames = new Set(availableRealmRoles.map((r) => r.name));
  return new Set(requestedRoleNames.filter((role) => availableNames.has(role)));
}

function classifyRoleChange(
  role: RealmRoleRef,
  currentRealmRoles: Set<string>,
  newRealmRoles: Set<string>,
  toAdd: RealmRoleRef[],
  toRemove: RealmRoleRef[]
) {
  const isRequested = newRealmRoles.has(role.name);
  const isCurrent = currentRealmRoles.has(role.name);
  if (isRequested && !isCurrent) toAdd.push(role);
  else if (isCurrent && !isRequested) toRemove.push(role);
}

export function computeRealmRoleDiff(input: {
  currentRealmRoleNames: string[];
  requestedRoleNames: string[];
  availableRealmRoles: RealmRoleRef[];
}): { toAdd: RealmRoleRef[]; toRemove: RealmRoleRef[] } {
  const currentRealmRoles = new Set(input.currentRealmRoleNames);
  const newRealmRoles = buildRequestedRoleSet(
    input.requestedRoleNames,
    input.availableRealmRoles
  );

  const toAdd: RealmRoleRef[] = [];
  const toRemove: RealmRoleRef[] = [];

  for (const role of input.availableRealmRoles) {
    classifyRoleChange(role, currentRealmRoles, newRealmRoles, toAdd, toRemove);
  }

  return { toAdd, toRemove };
}
