// src/routes/auth/authKeycloak/oidc.ts
import { Issuer, generators, Client } from "openid-client";

type Profile = "public" | "intranet";
let publicClient: Client | null = null;
let intranetClient: Client | null = null;

function toProfile(hostLike: string): Profile {
  return (hostLike || "").toLowerCase().includes(".intranet.")
    ? "intranet"
    : "public";
}

function assert(name: string, v?: string) {
  if (!v) throw new Error(`Missing env: ${name}`);
}

async function buildClient(
  issuerUrl: string,
  clientId: string,
  clientSecret: string,
  appBaseUrl: string
) {
  assert("issuerUrl", issuerUrl);
  assert("clientId", clientId);
  assert("clientSecret", clientSecret);
  assert("appBaseUrl", appBaseUrl);

  const issuer = await Issuer.discover(issuerUrl); // <— if this throws, you’ll see it

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
      intranetClient = await buildClient(
        process.env.KC_INTRANET_ISSUER_URL!,
        process.env.KC_INTRANET_CLIENT_ID!,
        process.env.KC_INTRANET_CLIENT_SECRET!,
        process.env.INTRANET_APP_BASE_URL!
      );
    }
    return {
      client: intranetClient,
      appBaseUrl: process.env.INTRANET_APP_BASE_URL!,
      profile,
    };
  }

  if (!publicClient) {
    publicClient = await buildClient(
      process.env.KC_PUBLIC_ISSUER_URL!,
      process.env.KC_PUBLIC_CLIENT_ID!,
      process.env.KC_PUBLIC_CLIENT_SECRET!,
      process.env.PUBLIC_APP_BASE_URL!
    );
  }
  return {
    client: publicClient,
    appBaseUrl: process.env.PUBLIC_APP_BASE_URL!,
    profile: "public",
  };
}

export const newState = () => generators.state();
export const newNonce = () => generators.nonce();
