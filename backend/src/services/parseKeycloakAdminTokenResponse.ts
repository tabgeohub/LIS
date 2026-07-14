import { Response } from "undici";

export type KeycloakAdminTokenPayload = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

export async function parseKeycloakAdminTokenResponse(response: Response) {
  const payload = (await response.json()) as KeycloakAdminTokenPayload;
  if (!response.ok) {
    const message =
      payload.error_description || payload.error || "Failed to get admin token";
    if (message.includes("service account") || message.includes("client not enabled")) {
      throw new Error(
        "Keycloak client is not configured for service account access. " +
          "Enable 'Service accounts roles' in your Keycloak client settings and assign the 'view-users' role from 'realm-management' client to the service account."
      );
    }
    throw new Error(message);
  }
  if (!payload.access_token) {
    throw new Error("Admin token response missing access_token");
  }
  return { token: payload.access_token, expiresInSeconds: payload.expires_in };
}
