import type { Request } from "express";
import {
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

export type CreateKeycloakUserInput = {
  username: string;
  email?: string;
  password: string;
  enabled?: boolean;
};

function extractUserIdFromLocation(location: string | null): string {
  if (!location) throw new Error("Failed to get user ID from response");
  const userId = location.split("/").pop();
  if (!userId) throw new Error("Failed to extract user ID from location");
  return userId;
}

async function assertKeycloakResponseOk(
  response: Response,
  forbiddenMessage: string,
  failurePrefix: string
) {
  if (response.ok) return;

  const text = await response.text();
  if (response.status === 403) throw new Error(forbiddenMessage);
  throw new Error(`${failurePrefix} (${response.status}): ${text}`);
}

async function createKeycloakUserRecord(
  req: Request,
  userData: CreateKeycloakUserInput
): Promise<string> {
  const response = await keycloakAdminFetch(req, "/users", {
    method: "POST",
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      enabled: userData.enabled ?? true,
      emailVerified: Boolean(userData.email),
      requiredActions: [],
    }),
  });

  await assertKeycloakResponseOk(
    response,
    "Service account lacks permission to create users. " +
      "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned.",
    "Failed to create user"
  );

  return extractUserIdFromLocation(response.headers.get("Location"));
}

async function setKeycloakUserPassword(
  req: Request,
  userId: string,
  password: string
) {
  const response = await keycloakAdminFetch(req, `/users/${userId}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({ type: "password", value: password, temporary: false }),
  });

  if (response.ok) return;

  try {
    await keycloakAdminFetch(req, `/users/${userId}`, { method: "DELETE" });
  } catch {
    /* ignore rollback errors */
  }

  await assertKeycloakResponseOk(
    response,
    "Service account lacks permission to set user passwords. " +
      "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned.",
    "Failed to set password"
  );
}

async function clearKeycloakRequiredActions(req: Request, userId: string) {
  const getUserResponse = await keycloakAdminFetch(req, `/users/${userId}`, {
    method: "GET",
  });
  if (!getUserResponse.ok) return;

  const existingUser = (await getUserResponse.json()) as Record<string, unknown>;
  const updateResponse = await keycloakAdminFetch(req, `/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({
      ...existingUser,
      enabled: true,
      emailVerified: existingUser.email ? true : existingUser.emailVerified,
      requiredActions: [],
    }),
  });

  if (!updateResponse.ok) {
    console.warn(
      `Failed to update user ${userId} to clear required actions:`,
      await updateResponse.text()
    );
  }
}

export async function createKeycloakUser(
  userData: CreateKeycloakUserInput,
  req: Request
): Promise<string> {
  const userId = await createKeycloakUserRecord(req, userData);
  await setKeycloakUserPassword(req, userId, userData.password);
  await clearKeycloakRequiredActions(req, userId);
  return userId;
}

export { handleKeycloakRouteError };
