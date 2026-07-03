import { resolveProfile } from "../routes/auth/authKeycloak/resolveProfile";
import { OIDC_PROFILES } from "../routes/auth/oidcProfiles";
import { fetch, Response } from "undici";
import { parseKeycloakIssuer } from "./parseKeycloakIssuer";

export async function getKeycloakAdminToken(req: any): Promise<string> {
  const profile = resolveProfile(req);
  const profileConfig = OIDC_PROFILES[profile];
  const { serverUrl, realm } = parseKeycloakIssuer(profileConfig.issuer);
  const tokenUrl = `${serverUrl}/realms/${realm}/protocol/openid-connect/token`;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: profileConfig.clientId,
    client_secret: profileConfig.clientSecret,
  });

  let response: Response;
  try {
    response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
  } catch (fetchError: any) {
    const errorMsg = fetchError?.message || String(fetchError);
    const errorCode = fetchError?.code || "UNKNOWN";
    console.error("[getKeycloakAdminToken] Fetch failed:", {
      error: errorMsg,
      code: errorCode,
      endpoint: tokenUrl,
      cause: fetchError?.cause,
    });
    throw new Error(
      `Failed to connect to Keycloak token endpoint: ${errorMsg} (${errorCode})`
    );
  }

  const json = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok) {
    const errorMsg =
      json.error_description || json.error || "Failed to get admin token";

    if (
      errorMsg.includes("service account") ||
      errorMsg.includes("client not enabled")
    ) {
      throw new Error(
        "Keycloak client is not configured for service account access. " +
          "Enable 'Service accounts roles' in your Keycloak client settings and assign the 'view-users' role from 'realm-management' client to the service account."
      );
    }

    throw new Error(errorMsg);
  }

  if (!json.access_token) {
    throw new Error("Admin token response missing access_token");
  }

  return json.access_token;
}

export function getKeycloakAdminBase(req: any): string {
  const profile = resolveProfile(req);
  const profileConfig = OIDC_PROFILES[profile];
  const { serverUrl, realm } = parseKeycloakIssuer(profileConfig.issuer);
  return `${serverUrl}/admin/realms/${realm}`;
}
