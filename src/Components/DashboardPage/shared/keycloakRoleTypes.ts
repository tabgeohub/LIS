export type AvailableRole = {
  id: string;
  name: string;
};

export type AvailableRoles = {
  realmRoles: AvailableRole[];
  clientRoles: Record<string, AvailableRole[]>;
};

export const unwantedRoles = [
  "default-roles-",
  "offline_access",
  "uma_authorization",
  "manage-account",
  "manage-account-links",
  "view-profile",
  "manage-realm",
];

export function isUnwantedRole(role: string): boolean {
  return unwantedRoles.some((unwanted) => role.includes(unwanted));
}

export function filterRealmRoles(roles: AvailableRole[]): AvailableRole[] {
  return roles.filter((role) => !isUnwantedRole(role.name));
}
