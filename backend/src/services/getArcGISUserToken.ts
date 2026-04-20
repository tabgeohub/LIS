import { fetch } from "undici";

type ArcGISTokenResponse = {
  access_token: string;
  server: string;
  expires_at: number;
};

type ArcGISTokenCache = {
  access_token: string;
  expires_at: number;
};

const SKEW_BUFFER_MS = 60_000;
let tokenCache: ArcGISTokenCache | null = null;

export async function getArcGISUserToken(): Promise<ArcGISTokenResponse> {
  const tokenEndpoint = process.env.ARCGIS_TOKEN_ENDPOINT || "";
  const clientId = process.env.ARCGIS_CLIENT_ID || "";
  const clientSecret = process.env.ARCGIS_CLIENT_SECRET || "";
  const serverUrl = process.env.ARCGIS_SERVER_URL || "";

  if (!tokenEndpoint) {
    throw new Error("Missing ARCGIS_TOKEN_ENDPOINT");
  }
  if (!clientId) {
    throw new Error("Missing ARCGIS_CLIENT_ID");
  }
  if (!clientSecret) {
    throw new Error("Missing ARCGIS_CLIENT_SECRET");
  }
  if (!serverUrl) {
    throw new Error("Missing ARCGIS_SERVER_URL");
  }

  const now = Date.now();
  if (tokenCache && now < tokenCache.expires_at) {
    return {
      access_token: tokenCache.access_token,
      server: serverUrl,
      expires_at: tokenCache.expires_at,
    };
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`ArcGIS token HTTP ${response.status}: ${text.slice(0, 300)}`);
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("ArcGIS token response is not valid JSON");
  }

  if (!json?.access_token || typeof json?.expires_in !== "number") {
    throw new Error("ArcGIS token response missing access_token or expires_in");
  }

  const expires_at = now + json.expires_in * 1000 - SKEW_BUFFER_MS;
  tokenCache = {
    access_token: String(json.access_token),
    expires_at,
  };

  return {
    access_token: tokenCache.access_token,
    server: serverUrl,
    expires_at: tokenCache.expires_at,
  };
}
