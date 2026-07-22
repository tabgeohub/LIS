import { Response } from "undici";

export type KeycloakAdminTokenPayload = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

const SERVICE_ACCOUNT_HINT =
  "Keycloak client is not configured for service account access. " +
  "Enable 'Service accounts roles' in your Keycloak client settings and assign the 'view-users' role from 'realm-management' client to the service account.";

function readTokenErrorMessage(payload: KeycloakAdminTokenPayload): string {
  return (
    payload.error_description || payload.error || "Failed to get admin token"
  );
}

function isServiceAccountConfigError(message: string): boolean {
  return (
    message.includes("service account") || message.includes("client not enabled")
  );
}

function throwOnFailedTokenResponse(payload: KeycloakAdminTokenPayload): never {
  const message = readTokenErrorMessage(payload);
  if (isServiceAccountConfigError(message)) {
    throw new Error(SERVICE_ACCOUNT_HINT);
  }
  throw new Error(message);
}

export async function parseKeycloakAdminTokenResponse(response: Response) {
  const payload = (await response.json()) as KeycloakAdminTokenPayload;
  if (!response.ok) {
    throwOnFailedTokenResponse(payload);
  }
  if (!payload.access_token) {
    throw new Error("Admin token response missing access_token");
  }
  return { token: payload.access_token, expiresInSeconds: payload.expires_in };
}
