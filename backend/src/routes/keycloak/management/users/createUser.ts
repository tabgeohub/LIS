import { Request, Response } from "express";
import { getKeycloakAdminToken } from "../../../../services/getKeycloakAdminToken";
import { getAdminBase } from "./helpers";
import { updateUserRoles } from "./updateUserRoles";
import { fetch } from "undici";

export async function createUser(
  userData: {
    username: string;
    email?: string;
    password: string;
    enabled?: boolean;
  },
  req: Request
): Promise<string> {
  const adminToken = await getKeycloakAdminToken(req);
  const adminBase = getAdminBase(req);

  const response = await fetch(`${adminBase}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
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

  // Get the user ID from the Location header
  const location = response.headers.get("Location");
  if (!location) {
    throw new Error("Failed to get user ID from response");
  }

  const userId = location.split("/").pop();
  if (!userId) {
    throw new Error("Failed to extract user ID from location");
  }

  // Set the password
  const passwordResponse = await fetch(
    `${adminBase}/users/${userId}/reset-password`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "password",
        value: userData.password,
        temporary: false,
      }),
    }
  );

  if (!passwordResponse.ok) {
    // Try to delete the user if password setting fails
    try {
      await fetch(`${adminBase}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
    } catch (deleteError) {
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

  // Fetch the user to get current state
  const getUserResponse = await fetch(`${adminBase}/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
  });

  if (getUserResponse.ok) {
    const userData = (await getUserResponse.json()) as any;

    // Update user to ensure it's fully set up for login
    const updateResponse = await fetch(`${adminBase}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        enabled: true,
        emailVerified: userData.email ? true : userData.emailVerified,
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

    // Create the user
    const userId = await createUser(
      {
        username,
        email,
        password,
        enabled: true,
      },
      req
    );

    // Assign role if provided (single role, not array)
    if (role) {
      await updateUserRoles(userId, [role], req);
    }

    res.json({ success: true, userId });
  } catch (error: any) {
    const message = error?.message || "Failed to create user";
    return res.status(500).json({ error: message });
  }
}

