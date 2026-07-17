// src/routes/auth/authKeycloak/oidc.ts
import { generators, Client } from "openid-client";
import { resolveOidcRequestProfile } from "./oidcProfile";
import { getOrCreateOidcClient } from "./oidcClientCache";

type Profile = "public" | "intranet";

export async function getOidcClientFor(req: any): Promise<{
  client: Client;
  appBaseUrl: string;
  profile: Profile;
}> {
  const profile = resolveOidcRequestProfile(req);
  return getOrCreateOidcClient(profile);
}

export const newState = () => generators.state();
export const newNonce = () => generators.nonce();
