import { Issuer, Client, custom } from "openid-client";
// @ts-ignore
import { HttpsProxyAgent } from "https-proxy-agent";
import { getCorporateProxyUrl } from "../../helpers/http/outboundHttpProxy";

type Profile = "public" | "intranet";

let publicClient: Client | null = null;
let intranetClient: Client | null = null;
let httpOptionsConfigured = false;

function configureOidcHttpOptions() {
  if (httpOptionsConfigured) return;

  const timeout = parseInt(
    process.env.OIDC_DISCOVERY_TIMEOUT_MS || "15000",
    10
  );

  const proxyUrl = getCorporateProxyUrl();

  if (proxyUrl) {
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

  return new issuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [`${appBaseUrl}/auth/callback`],
    response_types: ["code"],
  });
}

export async function getOrCreateOidcClient(
  profile: Profile
): Promise<{ client: Client; appBaseUrl: string; profile: Profile }> {
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
