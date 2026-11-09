import type { MigrationConfig } from "./types";

export const PROD_MIGRATION_CONFIG: MigrationConfig = {
  enabled: true,
  sourceInstance: "9c8b5118-6688-4dbb-8b07-124b72ed00d0",
  sourceEnvironment: "TST",
  exportKeyId: "rws-lis-one-shot-20261107",
  trustedPublicKeys: {
    "rws-lis-one-shot-20261107": `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA02dtpvCFt3DFyPo2NCSMxEJuJz+sUhAqlZpO9eE6qMk=
-----END PUBLIC KEY-----`,
  },
  arcgisAllowedOrigins: ["https://services-eu1.arcgis.com"],
  browserOrigins: ["https://lis.rws.nl"],
};

export function isProdHostname(hostname: string): boolean { return hostname.toLowerCase() === "lis.rws.nl"; }
export function migrationConfig(hostname: string): MigrationConfig {
  return isProdHostname(hostname) ? PROD_MIGRATION_CONFIG : { ...PROD_MIGRATION_CONFIG, enabled: false };
}
export function isTrustedTstSource(source: { instance: string; environment: string }): boolean {
  return source.instance === PROD_MIGRATION_CONFIG.sourceInstance && source.environment === PROD_MIGRATION_CONFIG.sourceEnvironment;
}
