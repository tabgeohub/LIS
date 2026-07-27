import { getBackEndUrl } from "@helpers/getBackEndUrl";

function optionalField(value: string | undefined): string | undefined {
  return value || undefined;
}

async function readJsonBody(response: Response): Promise<{ error?: string }> {
  return response.json().catch(() => ({}));
}

function assertKeycloakOk(input: {
  response: Response;
  data: { error?: string };
  fallback: string;
}): void {
  if (!input.response.ok) {
    throw new Error(input.data.error || input.fallback);
  }
}

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
        email: optionalField(input.email),
      }),
    }
  );

  const errorData = await readJsonBody(response);
  assertKeycloakOk({
    response,
    data: errorData,
    fallback: "Failed to update user",
  });
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

  const errorData = await readJsonBody(response);
  assertKeycloakOk({
    response,
    data: errorData,
    fallback: "Failed to update user roles",
  });
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
        email: optionalField(input.email),
        password: input.password,
        role: optionalField(input.role),
      }),
    }
  );

  const data = await readJsonBody(response);
  assertKeycloakOk({
    response,
    data,
    fallback: "Failed to create user",
  });
}
