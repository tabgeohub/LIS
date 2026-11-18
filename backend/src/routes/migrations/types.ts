export type MigrationConfig = {
  enabled: boolean;
  sourceInstance: string;
  sourceEnvironment: string;
  exportKeyId: string;
  trustedPublicKeys: Record<string, string>;
  arcgisAllowedOrigins: string[];
  browserOrigins: string[];
};
