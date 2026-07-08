// src/routes/auth/authKeycloak/oidc.ts
import { Issuer, generators, Client, custom } from "openid-client";
// @ts-ignore
import { HttpsProxyAgent } from "https-proxy-agent";

type Profile = "public" | "intranet";
let publicClient: Client | null = null;
let intranetClient: Client | null = null;

let httpOptionsConfigured = false;

// Configure how openid-client makes its server-to-Keycloak HTTP calls
// (discovery + token exchange). In environments that only allow outbound
// traffic via a corporate proxy (HTTPS_PROXY/HTTP_PROXY), route through it.
// When no proxy env var is set (local dev, desktop), behavior is unchanged.
function configureOidcHttpOptions() {
  if (httpOptionsConfigured) return;

  const timeout = parseInt(
    process.env.OIDC_DISCOVERY_TIMEOUT_MS || "15000",
    10
  );

  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  if (proxyUrl) {
    // HttpsProxyAgent tunnels HTTPS through the proxy, which is exactly what
    // openid-client's native request needs. v5's default export is a factory.
    const agent = new HttpsProxyAgent(
      proxyUrl
    ) as unknown as import("http").Agent;
    custom.setHttpOptionsDefaults({ timeout, agent });
    console.log("[oidc] outbound HTTP configured via proxy:", proxyUrl);
  } else {
    custom.setHttpOptionsDefaults({ timeout });
  }

  httpOptionsConfigured = true;
}

function toProfile(hostLike: string): Profile {
  return (hostLike || "").toLowerCase().includes(".intranet.")
    ? "intranet"
    : "public";
}

function assert(name: string, v?: string) {
  if (!v) throw new Error(`Missing env: ${name}`);
}

type BuildOidcClientInput = {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  appBaseUrl: string;
};

async function buildClient(input: BuildOidcClientInput) {
  const { issuerUrl, clientId, clientSecret, appBaseUrl } = input;
  assert("issuerUrl", issuerUrl);
  assert("clientId", clientId);
  assert("clientSecret", clientSecret);
  assert("appBaseUrl", appBaseUrl);

  configureOidcHttpOptions();

  const issuer = await Issuer.discover(issuerUrl);

  const client = new issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [`${appBaseUrl}/auth/callback`],
    response_types: ["code"],
  });

  return client;
}

export async function getOidcClientFor(req: any): Promise<{
  client: Client;
  appBaseUrl: string;
  profile: Profile;
}> {
  // 1) Prefer what loginHandler already decided
  const sessionProfile: Profile | undefined = req.session?.oidcProfile;

  // 2) Otherwise infer from headers (prefer Referer)
  const referer = req.get?.("referer") as string | undefined;
  const origin = req.get?.("origin") as string | undefined;
  const xfHost = (req.headers?.["x-forwarded-host"] as string) || undefined;
  const host = req.get?.("host") as string | undefined;

  // @ts-ignore
  const inferred = toProfile(referer || origin || xfHost || host);
  const profile: Profile = sessionProfile || inferred;

  if (profile === "intranet") {
    if (!intranetClient) {
      intranetClient = await buildClient({
        issuerUrl: process.env.KC_INTRANET_ISSUER_URL!,
        clientId: process.env.KC_INTRANET_CLIENT_ID!,
        clientSecret: process.env.KC_INTRANET_CLIENT_SECRET!,
        appBaseUrl: process.env.INTRANET_APP_BASE_URL!,
      });
    }
    return {
      client: intranetClient,
      appBaseUrl: process.env.INTRANET_APP_BASE_URL!,
      profile,
    };
  }

  if (!publicClient) {
    publicClient = await buildClient({
      issuerUrl: process.env.KC_PUBLIC_ISSUER_URL!,
      clientId: process.env.KC_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.KC_PUBLIC_CLIENT_SECRET!,
      appBaseUrl: process.env.PUBLIC_APP_BASE_URL!,
    });
  }
  return {
    client: publicClient,
    appBaseUrl: process.env.PUBLIC_APP_BASE_URL!,
    profile: "public",
  };
}

export const newState = () => generators.state();
export const newNonce = () => generators.nonce();
