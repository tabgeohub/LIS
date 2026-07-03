import { getBackEndUrl } from "@helpers/getBackEndUrl";

export async function updateKeycloakUserProfile(input: {
  userId: string;
  username: string;
  email: string;
}) {
  const response = await fetch(
    `${getBackEndUrl()}/api/keycloak/management/users/${input.userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: input.username,
        email: input.email || undefined,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update user");
  }
}

export async function assignKeycloakUserRoles(input: {
  userId: string;
  roles: string[];
}) {
  const response = await fetch(
    `${getBackEndUrl()}/api/keycloak/management/users/${input.userId}/roles`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ roles: input.roles }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update user roles");
  }
}

export async function createKeycloakUser(input: {
  username: string;
  email?: string;
  password: string;
  role?: string;
}) {
  const response = await fetch(
    `${getBackEndUrl()}/api/keycloak/management/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: input.username,
        email: input.email || undefined,
        password: input.password,
        role: input.role || undefined,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Failed to create user");
  }
}
