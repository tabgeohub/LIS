const REQUIRED_ENV_VARS = [
  "SESSION_SECRET",
  "PGUSER",
  "PGHOST",
  "PGDATABASE",
  "PGPASSWORD",
  "ARCGIS_TOKEN_ENDPOINT",
  "ARCGIS_CLIENT_ID",
  "ARCGIS_CLIENT_SECRET",
  "ARCGIS_SERVER_URL",
];

export function assertRequiredEnvVars(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  console.error("❌ Missing required environment variables:");
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error(
    "\n💡 Please create a .env file in the backend directory with these variables."
  );
  process.exit(1);
}

export function warnIfHttpsWithoutProduction(): void {
  const publicBaseUrl = process.env.PUBLIC_APP_BASE_URL || "";
  if (!publicBaseUrl.startsWith("https://") || process.env.NODE_ENV === "production") {
    return;
  }
  console.warn(
    JSON.stringify({
      type: "lis.startup",
      event: "node_env_warning",
      message:
        "PUBLIC_APP_BASE_URL uses HTTPS but NODE_ENV is not production — set NODE_ENV=production on acc/prod",
      ts: new Date().toISOString(),
    })
  );
}
