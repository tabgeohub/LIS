import { Request, Response } from "express";
import { updateUserRoles } from "./updateUserRoles";
import {
  createKeycloakUser,
  handleKeycloakRouteError,
} from "./createKeycloakUser";

export async function handleCreateUser(req: Request, res: Response) {
  try {
    const { username, email, password, role } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const userId = await createKeycloakUser(
      { username, email, password, enabled: true },
      req
    );

    if (role) {
      await updateUserRoles({ userId, roles: [role], req });
    }

    res.json({ success: true, userId });
  } catch (error: unknown) {
    handleKeycloakRouteError({ res, error, fallbackMessage: "Failed to create user" });
  }
}

// Backwards-compatible re-export for callers importing createUser from this module.
export { createKeycloakUser as createUser } from "./createKeycloakUser";
