import type { Request, Response } from "express";
import { keycloakAdminFetch } from "./keycloakAdminClient";

export function validateResetPasswordInput(
  req: Request,
  res: Response
): { id: string; password: string; temporary: boolean } | null {
  const { id } = req.params;
  const { password, temporary = false } = req.body;

  if (!id) {
    res.status(400).json({ error: "User ID is required" });
    return null;
  }
  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return null;
  }
  return { id, password, temporary };
}

export async function putKeycloakResetPassword(
  req: Request,
  input: { id: string; password: string; temporary: boolean }
) {
  return keycloakAdminFetch(req, `/users/${input.id}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({
      type: "password",
      value: input.password,
      temporary: input.temporary,
    }),
  });
}

export async function throwIfResetPasswordFailed(options: {
  response: Awaited<ReturnType<typeof keycloakAdminFetch>>;
}): Promise<void> {
  const { response } = options;
  if (response.ok) return;

  const text = await response.text();
  if (response.status === 403) {
    throw new Error(
      "Service account lacks permission to reset user passwords. " +
        "Ensure the service account has the 'manage-users' role from the 'realm-management' client assigned."
    );
  }
  if (response.status === 404) {
    throw new Error("User not found");
  }
  throw new Error(`Failed to reset password (${response.status}): ${text}`);
}
