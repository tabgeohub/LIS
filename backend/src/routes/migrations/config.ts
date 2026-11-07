/** Deliberately opt-in. A process with no explicit configuration exposes no migration operation. */
export type MigrationConfig = {
  enabled: boolean; role: "source" | "destination" | "both";
  sourceInstance: string; sourceEnvironment: string; sourceIssuer: string;
  sourceBackendUrl: string; destinationFrontendUrl: string;
  statusBackendUrl: string; destinationIssuer: string; destinationRegions: string[]; arcgisAllowedOrigins: string[];
  exportKeyId: string; exportPrivateKey: string; trustedPublicKeys: Record<string, string>;
  exportReadCredential: string; statusReadCredential: string;
};

function enabled(value: string | undefined): boolean { return value?.trim().toLowerCase() === "true"; }
function uuid(value: string): boolean { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function url(value: string | undefined): string { return (value || "").replace(/\/$/, ""); }
function keys(value: string | undefined): Record<string, string> {
  if (!value) return {};
  try { const parsed = JSON.parse(value); return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, string> : {}; } catch { return {}; }
}
function strings(value: string | undefined): string[] {
  if (!value) return [];
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.length > 0) : []; } catch { return value.split(",").map(item => item.trim()).filter(Boolean); }
}
export function migrationConfig(env: NodeJS.ProcessEnv = process.env): MigrationConfig {
  const roleValue = env.MIGRATION_ROLE;
  const role = roleValue === "source" || roleValue === "destination" || roleValue === "both" ? roleValue : "source";
  return {
    enabled: enabled(env.MIGRATION_ENABLED), role,
    sourceInstance: env.MIGRATION_SOURCE_INSTANCE_UUID || "",
    sourceEnvironment: env.MIGRATION_SOURCE_ENVIRONMENT || "TST",
    sourceIssuer: env.MIGRATION_SOURCE_ISSUER || "",
    sourceBackendUrl: url(env.MIGRATION_SOURCE_BACKEND_URL),
    destinationFrontendUrl: url(env.MIGRATION_DESTINATION_FRONTEND_URL),
    statusBackendUrl: url(env.MIGRATION_STATUS_BACKEND_URL), destinationIssuer: env.MIGRATION_DESTINATION_ISSUER || "",
    destinationRegions: strings(env.MIGRATION_DESTINATION_REGION_ROLES), arcgisAllowedOrigins: strings(env.MIGRATION_ARCGIS_ALLOWED_ORIGINS_JSON),
    exportKeyId: env.MIGRATION_EXPORT_SIGNING_KEY_ID || "",
    exportPrivateKey: (env.MIGRATION_EXPORT_SIGNING_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    trustedPublicKeys: keys(env.MIGRATION_TRUSTED_EXPORT_PUBLIC_KEYS_JSON),
    exportReadCredential: env.MIGRATION_EXPORT_READ_CREDENTIAL || "",
    statusReadCredential: env.MIGRATION_STATUS_READ_CREDENTIAL || "",
  };
}
export function configuredForSource(config: MigrationConfig): boolean {
  return config.enabled && (config.role === "source" || config.role === "both") && Boolean(uuid(config.sourceInstance) && config.sourceIssuer && config.destinationFrontendUrl && config.exportKeyId && config.exportPrivateKey && config.exportReadCredential);
}
export function configuredForDestination(config: MigrationConfig): boolean {
  return config.enabled && (config.role === "destination" || config.role === "both") && Boolean(uuid(config.sourceInstance) && config.sourceBackendUrl && config.exportReadCredential && config.statusReadCredential && config.destinationIssuer && config.destinationRegions.length && config.arcgisAllowedOrigins.length && Object.keys(config.trustedPublicKeys).length);
}
