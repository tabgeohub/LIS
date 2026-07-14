import { resolveProfile } from "../routes/auth/authKeycloak/resolveProfile";
import { OIDC_PROFILES } from "../routes/auth/oidcProfiles";
import { parseKeycloakIssuer } from "./parseKeycloakIssuer";

export function createKeycloakAdminContext(req: any) {
  const profile = resolveProfile(req);
  const profileConfig = OIDC_PROFILES[profile];
  const { serverUrl, realm } = parseKeycloakIssuer(profileConfig.issuer);
  return {
    profile,
    baseUrl: `${serverUrl}/admin/realms/${realm}`,
    tokenUrl: `${serverUrl}/realms/${realm}/protocol/openid-connect/token`,
    tokenParams: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: profileConfig.clientId,
      client_secret: profileConfig.clientSecret,
    }),
  };
}
