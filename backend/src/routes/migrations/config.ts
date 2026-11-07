/** Local, read-only finished-flight listing configuration. */
export type MigrationConfig = {
  enabled: boolean; readOnly: boolean; role: "source" | "destination" | "both";
  sourceInstance: string; sourceEnvironment: string;
  sourceBackendUrl: string; destinationFrontendUrl: string;
  statusBackendUrl: string; destinationRegions: string[]; arcgisAllowedOrigins: string[];
  browserOrigins: string[];
  exportKeyId: string; exportPrivateKey: string; trustedPublicKeys: Record<string, string>;
  exportReadCredential: string; statusReadCredential: string;
};

/** No deployed host enables the former transfer feature. */
export const MIGRATION_CODE_CONFIG: MigrationConfig = {
  enabled: false,
  readOnly: false,
  role: "source",
  sourceInstance: "", sourceEnvironment: "LOCAL",
  sourceBackendUrl: "", destinationFrontendUrl: "", statusBackendUrl: "",
  destinationRegions: [], arcgisAllowedOrigins: [], browserOrigins: ["http://localhost:3000", "http://localhost:5000"],
  exportKeyId: "", exportPrivateKey: "", trustedPublicKeys: {}, exportReadCredential: "", statusReadCredential: "",
};
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
  const overrides = typeof input === "string"
    ? (["localhost", "127.0.0.1"].includes(hostname) ? MIGRATION_LOCALHOST_CONFIG : { enabled: false })
    : input;
  return normalized({ ...MIGRATION_CODE_CONFIG, ...overrides, destinationRegions: overrides.destinationRegions ?? MIGRATION_CODE_CONFIG.destinationRegions, arcgisAllowedOrigins: overrides.arcgisAllowedOrigins ?? MIGRATION_CODE_CONFIG.arcgisAllowedOrigins, browserOrigins: overrides.browserOrigins ?? MIGRATION_CODE_CONFIG.browserOrigins, trustedPublicKeys: overrides.trustedPublicKeys ?? MIGRATION_CODE_CONFIG.trustedPublicKeys });
}
export function configuredForSource(config: MigrationConfig): boolean {
  return config.enabled && (config.role === "source" || config.role === "both");
}
export function configuredForDestination(config: MigrationConfig): boolean {
  return config.enabled && (config.role === "destination" || config.role === "both") && Boolean(uuid(config.sourceInstance) && config.sourceBackendUrl && config.exportReadCredential && config.statusReadCredential && config.arcgisAllowedOrigins.length && Object.keys(config.trustedPublicKeys).length);
}
