export type OidcProfile = {
  key: "public" | "intranet";
  issuer: string;
  clientId: string;
  clientSecret: string;
  appBaseUrl: string; // backend base used to build redirect_uri
  frontendUrl: string; // where we send the user after login/logout
};

export const OIDC_PROFILES: Record<string, OidcProfile> = {
  public: {
    key: "public",
    issuer: process.env.KC_PUBLIC_ISSUER_URL!, // e.g. https://otggate.rws.nl/realms/tst-lis
    clientId: process.env.KC_PUBLIC_CLIENT_ID!,
    clientSecret: process.env.KC_PUBLIC_CLIENT_SECRET!,
    appBaseUrl: process.env.PUBLIC_APP_BASE_URL!, // e.g. https://acc-lis.rws.nl/backend
    frontendUrl: process.env.PUBLIC_FRONTEND_URL!, // e.g. https://acc-lis.rws.nl
  },
  intranet: {
    key: "intranet",
    issuer: process.env.KC_INTRANET_ISSUER_URL!, // e.g. https://otggate.rws.nl/realms/tst-lis-intranet
    clientId: process.env.KC_INTRANET_CLIENT_ID!,
    clientSecret: process.env.KC_INTRANET_CLIENT_SECRET!,
    appBaseUrl: process.env.INTRANET_APP_BASE_URL!, // e.g. https://acc-lis.intranet.rws.nl/backend
    frontendUrl: process.env.INTRANET_FRONTEND_URL!, // e.g. https://acc-lis.intranet.rws.nl
  },
};
