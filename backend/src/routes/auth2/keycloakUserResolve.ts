import type { Request } from "express";
import { keycloakAdminFetch } from "../keycloak/management/users/keycloakAdminClient";
import { hashUsername, logAuthSecurityEvent } from "./authSecurityLog";

type KeycloakUserRecord = {
  id?: string;
  username?: string;
  email?: string;
  enabled?: boolean;
};

type ResolveResult =
  | { ok: true; user: KeycloakUserRecord & { id: string } }
  | { ok: false; reason: "not_found" | "lookup_unavailable" };

export function findUserByIdentity(users: KeycloakUserRecord[], identity: string) {
  const normalized = identity.toLowerCase();
  return users.find(
    (entry) =>
      entry?.id &&
      (String(entry.username || "").toLowerCase() === normalized ||
        String(entry.email || "").toLowerCase() === normalized)
  );
}

async function searchKeycloakUser(req: Request, username: string) {
  const response = await keycloakAdminFetch(
    req,
    `/users?search=${encodeURIComponent(username)}&max=20`,
    { method: "GET" }
  );
  if (!response.ok) return undefined;
  return findUserByIdentity(
    (await response.json()) as KeycloakUserRecord[],
    username
  );
}

async function fetchExactUsernameUsers(req: Request, username: string) {
  const response = await keycloakAdminFetch(
    req,
    `/users?username=${encodeURIComponent(username)}&exact=true`,
    { method: "GET" }
  );
  if (!response.ok) {
    logAuthSecurityEvent({
      event: "auth2.lookup.users_failed",
      meta: {
        usernameHash: hashUsername(username),
        status: response.status,
      },
    });
    return null;
  }
  return (await response.json()) as KeycloakUserRecord[];
}

export async function resolveKeycloakUserRecord(
  req: Request,
  username: string
): Promise<ResolveResult> {
  const users = await fetchExactUsernameUsers(req, username);
  if (users === null) return { ok: false, reason: "lookup_unavailable" };

  let user = findUserByIdentity(users, username);
  if (!user?.id) user = await searchKeycloakUser(req, username);
  if (!user?.id || user.enabled === false) {
    return { ok: false, reason: "not_found" };
  }
  return { ok: true, user: user as KeycloakUserRecord & { id: string } };
}
