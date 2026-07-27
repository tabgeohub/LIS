export type RealmRoleRef = { id: string; name: string };

function buildRequestedRoleSet(
  requestedRoleNames: string[],
  availableRealmRoles: RealmRoleRef[]
): Set<string> {
  const availableNames = new Set(availableRealmRoles.map((r) => r.name));
  return new Set(requestedRoleNames.filter((role) => availableNames.has(role)));
}

function classifyRoleChange(input: {
  role: RealmRoleRef;
  currentRealmRoles: Set<string>;
  newRealmRoles: Set<string>;
  toAdd: RealmRoleRef[];
  toRemove: RealmRoleRef[];
}) {
  const isRequested = input.newRealmRoles.has(input.role.name);
  const isCurrent = input.currentRealmRoles.has(input.role.name);
  if (isRequested && !isCurrent) input.toAdd.push(input.role);
  else if (isCurrent && !isRequested) input.toRemove.push(input.role);
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
    classifyRoleChange({
      role,
      currentRealmRoles,
      newRealmRoles,
      toAdd,
      toRemove,
    });
  }

  return { toAdd, toRemove };
}
