import { Request, Response } from "express";
import { updateUserRoles } from "./updateUserRoles";
import {
  handleKeycloakRouteError,
  keycloakAdminFetch,
} from "./keycloakAdminClient";

export async function createUser(
  userData: {
    username: string;
    email?: string;
    password: string;
    enabled?: boolean;
  },
  req: Request
): Promise<string> {
  const response = await keycloakAdminFetch(req, "/users", {
    method: "POST",
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      enabled: userData.enabled !== undefined ? userData.enabled : true,
      emailVerified: userData.email ? true : false,
      requiredActions: [],
    }),
  });

  if (!response.ok) {
    const text = await response.text();

    if (response.status === 403) {
      throw new Error(
        "Service account lacks permission to create users. " +
          "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned."
      );
    }

    throw new Error(`Failed to create user (${response.status}): ${text}`);
  }

  const location = response.headers.get("Location");
  if (!location) {
    throw new Error("Failed to get user ID from response");
  }

  const userId = location.split("/").pop();
  if (!userId) {
    throw new Error("Failed to extract user ID from location");
  }

  const passwordResponse = await keycloakAdminFetch(
    req,
    `/users/${userId}/reset-password`,
    {
      method: "PUT",
      body: JSON.stringify({
        type: "password",
        value: userData.password,
        temporary: false,
      }),
    }
  );

  if (!passwordResponse.ok) {
    try {
      await keycloakAdminFetch(req, `/users/${userId}`, { method: "DELETE" });
    } catch {
      // Ignore delete errors
    }

    const text = await passwordResponse.text();

    if (passwordResponse.status === 403) {
      throw new Error(
        "Service account lacks permission to set user passwords. " +
          "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned."
      );
    }

    throw new Error(
      `Failed to set password (${passwordResponse.status}): ${text}`
    );
  }

  const getUserResponse = await keycloakAdminFetch(req, `/users/${userId}`, {
    method: "GET",
  });

  if (getUserResponse.ok) {
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

  return userId;
}

export async function handleCreateUser(req: Request, res: Response) {
  try {
    const { username, email, password, role } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const userId = await createUser(
      {
        username,
        email,
        password,
        enabled: true,
      },
      req
    );

    if (role) {
      await updateUserRoles(userId, [role], req);
    }

    res.json({ success: true, userId });
  } catch (error: unknown) {
    handleKeycloakRouteError(res, error, "Failed to create user");
  }
}
