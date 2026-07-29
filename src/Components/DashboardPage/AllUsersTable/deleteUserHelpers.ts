import { getBackEndUrl } from "@helpers/http/getBackEndUrl";
import type { KeycloakUser } from "hooks/zustand/ui/usersManagementState";

export async function deleteKeycloakUser(userId: string): Promise<void> {
  const response = await fetch(
    `${getBackEndUrl()}/api/keycloak/management/users/${userId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to delete user");
  }
}

export function removeDeletedUserFromList(
  users: KeycloakUser[],
  deletedUserId: string
): KeycloakUser[] {
  return users.filter((user) => user.id !== deletedUserId);
}
