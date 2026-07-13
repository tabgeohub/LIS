import { resolveProfile } from "../routes/auth/authKeycloak/resolveProfile";
import { OIDC_PROFILES } from "../routes/auth/oidcProfiles";
import { fetch, Response } from "undici";
import { ensureUndiciCorporateProxy } from "../helpers/http/outboundHttpProxy";
import { parseKeycloakIssuer } from "./parseKeycloakIssuer";

type CachedAdminToken = { token: string; expiresAtMs: number };

// Cache the service-account (client_credentials) admin token per OIDC profile.
// Previously this was re-fetched on every admin API hop, adding a full token
// round-trip to each Keycloak lookup and multiplying the chance of an
// intermittent failure that broke OTP routing during login.
const adminTokenCache = new Map<string, CachedAdminToken>();

// Refresh a little before the real expiry to avoid using a token that expires
// mid-request. Fallback lifetime is used when Keycloak omits expires_in.
const ADMIN_TOKEN_EXPIRY_SKEW_MS = 30_000;
const ADMIN_TOKEN_FALLBACK_TTL_MS = 60_000;

function getAdminTokenTimeoutMs(): number {
  const parsed = parseInt(
    process.env.KEYCLOAK_ADMIN_TOKEN_TIMEOUT_MS || "15000",
    10
  );
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000;
}

export async function getKeycloakAdminToken(req: any): Promise<string> {
  // Acceptance requires outbound HTTPS via corporate proxy (same env as OIDC).
  ensureUndiciCorporateProxy();

  const profile = resolveProfile(req);

  const cached = adminTokenCache.get(profile);
  if (cached && cached.expiresAtMs > Date.now()) {
    return cached.token;
  }

  const profileConfig = OIDC_PROFILES[profile];
  const { serverUrl, realm } = parseKeycloakIssuer(profileConfig.issuer);
  const tokenUrl = `${serverUrl}/realms/${realm}/protocol/openid-connect/token`;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: profileConfig.clientId,
    client_secret: profileConfig.clientSecret,
  });

  // One transient-failure retry: connection hiccups to Keycloak are exactly the
  // intermittent condition that used to cascade into a broken login.
  const timeoutMs = getAdminTokenTimeoutMs();
  let response: Response;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
        signal: AbortSignal.timeout(timeoutMs),
      });
      lastError = undefined;
      break;
    } catch (fetchError: any) {
      lastError = fetchError;
      const errorMsg = fetchError?.message || String(fetchError);
      const errorCode = fetchError?.code || "UNKNOWN";
      console.error(
        `[getKeycloakAdminToken] Fetch failed (attempt ${attempt}/2):`,
        {
          error: errorMsg,
          code: errorCode,
          endpoint: tokenUrl,
          cause: fetchError?.cause,
        }
      );
    }
  }

  if (lastError) {
    const errorMsg = (lastError as any)?.message || String(lastError);
    const errorCode = (lastError as any)?.code || "UNKNOWN";
    throw new Error(
      `Failed to connect to Keycloak token endpoint: ${errorMsg} (${errorCode})`
    );
  }

  const json = (await response!.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!response!.ok) {
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

  const ttlMs =
    typeof json.expires_in === "number" && json.expires_in > 0
      ? json.expires_in * 1000
      : ADMIN_TOKEN_FALLBACK_TTL_MS;
  adminTokenCache.set(profile, {
    token: json.access_token,
    expiresAtMs: Date.now() + Math.max(ttlMs - ADMIN_TOKEN_EXPIRY_SKEW_MS, 0),
  });

  return json.access_token;
}

export function getKeycloakAdminBase(req: any): string {
  const profile = resolveProfile(req);
  const profileConfig = OIDC_PROFILES[profile];
  const { serverUrl, realm } = parseKeycloakIssuer(profileConfig.issuer);
  return `${serverUrl}/admin/realms/${realm}`;
}
