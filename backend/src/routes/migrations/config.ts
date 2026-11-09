/** Code-owned configuration for the one-shot, no-storage transfer. */
export type MigrationConfig = {
  enabled: boolean; readOnly: boolean; role: "source" | "destination" | "both";
  sourceInstance: string; sourceEnvironment: string;
  sourceBackendUrl: string; destinationFrontendUrl: string;
  statusBackendUrl: string; destinationRegions: string[]; arcgisAllowedOrigins: string[];
  browserOrigins: string[];
  exportKeyId: string; exportPrivateKey: string; trustedPublicKeys: Record<string, string>;
  exportReadCredential: string; statusReadCredential: string;
};

/**
 * The source key is deliberately code-owned at the user's request. Rotate it
 * before any real release; this feature never stores exports or transfer state.
 */
export const MIGRATION_CODE_CONFIG: MigrationConfig = {
  enabled: true,
  readOnly: false,
  role: "source",
  sourceInstance: "9c8b5118-6688-4dbb-8b07-124b72ed00d0", sourceEnvironment: "TST",
  sourceBackendUrl: "https://tst-lis.rws.nl/backend", destinationFrontendUrl: "https://lis.rws.nl", statusBackendUrl: "",
  destinationRegions: [], arcgisAllowedOrigins: ["https://services-eu1.arcgis.com"], browserOrigins: ["https://tst-lis.rws.nl", "https://lis.rws.nl", "http://localhost:3000", "http://localhost:5000"],
  exportKeyId: "rws-lis-one-shot-20261107",
  exportPrivateKey: `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIMK2yPEZgibc1s9i9ruO2yTSWs1SdPZFwDcx76TU2Gsv
-----END PRIVATE KEY-----`,
  trustedPublicKeys: {
    "rws-lis-one-shot-20261107": `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA02dtpvCFt3DFyPo2NCSMxEJuJz+sUhAqlZpO9eE6qMk=
-----END PUBLIC KEY-----`,
  },
  exportReadCredential: "", statusReadCredential: "",
};
export const MIGRATION_DEPLOYMENT_ROLES: Record<string, MigrationConfig["role"]> = {
  "tst-lis.rws.nl": "source",
  "lis.rws.nl": "destination",
};
export function deploymentRoleForHost(hostname: string): MigrationConfig["role"] | undefined {
  return MIGRATION_DEPLOYMENT_ROLES[hostname.toLowerCase()];
}
/** Localhost may list finished flights from the configured local database only. */
export const MIGRATION_LOCALHOST_CONFIG: Partial<MigrationConfig> = {
  enabled: true,
  readOnly: true,
  role: "source",
  destinationFrontendUrl: "http://localhost:3000",
  statusBackendUrl: "",
  browserOrigins: ["http://localhost:3000", "http://localhost:5000"],
};
function uuid(value: string): boolean { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function normalized(config: MigrationConfig): MigrationConfig {
  return { ...config, sourceBackendUrl: config.sourceBackendUrl.replace(/\/$/, ""), destinationFrontendUrl: config.destinationFrontendUrl.replace(/\/$/, ""), statusBackendUrl: config.statusBackendUrl.replace(/\/$/, ""), exportPrivateKey: config.exportPrivateKey.replace(/\\n/g, "\n"), destinationRegions: [...config.destinationRegions], arcgisAllowedOrigins: [...config.arcgisAllowedOrigins], browserOrigins: [...config.browserOrigins], trustedPublicKeys: { ...config.trustedPublicKeys } };
}
/** Runtime reads only code-owned values. Overrides are for local fixtures. */
export function migrationConfig(input: string | Partial<MigrationConfig> = {}): MigrationConfig {
  const hostname = typeof input === "string" ? input.toLowerCase() : "";
  const deploymentRole = hostname ? deploymentRoleForHost(hostname) : undefined;
  const overrides = typeof input === "string"
    ? (["localhost", "127.0.0.1"].includes(hostname) ? MIGRATION_LOCALHOST_CONFIG : deploymentRole ? { enabled: true, role: deploymentRole } : { enabled: false })
    : input;
  return normalized({ ...MIGRATION_CODE_CONFIG, ...overrides, destinationRegions: overrides.destinationRegions ?? MIGRATION_CODE_CONFIG.destinationRegions, arcgisAllowedOrigins: overrides.arcgisAllowedOrigins ?? MIGRATION_CODE_CONFIG.arcgisAllowedOrigins, browserOrigins: overrides.browserOrigins ?? MIGRATION_CODE_CONFIG.browserOrigins, trustedPublicKeys: overrides.trustedPublicKeys ?? MIGRATION_CODE_CONFIG.trustedPublicKeys });
}
export function configuredForSource(config: MigrationConfig): boolean {
  return config.enabled && (config.role === "source" || config.role === "both") && Boolean(uuid(config.sourceInstance) && config.exportKeyId && config.exportPrivateKey);
}
export function configuredForDestination(config: MigrationConfig): boolean {
  return config.enabled && (config.role === "destination" || config.role === "both") && Boolean(uuid(config.sourceInstance) && config.arcgisAllowedOrigins.length && Object.keys(config.trustedPublicKeys).length);
}
