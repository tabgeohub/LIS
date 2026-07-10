import app, { appReady } from "./app";

// Validate required environment variables
const requiredEnvVars = [
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

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((key) => console.error(`   - ${key}`));
  console.error(
    "\n💡 Please create a .env file in the backend directory with these variables."
  );
  process.exit(1);
}

const publicBaseUrl = process.env.PUBLIC_APP_BASE_URL || "";
if (publicBaseUrl.startsWith("https://") && process.env.NODE_ENV !== "production") {
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

const port = Number(process.env.PORT || 5000);

async function startServer() {
  await appReady;

  const server = app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
      case "EACCES":
        console.error(`❌ ${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`❌ ${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.requestTimeout = 3600000; // 1 hour
  server.headersTimeout = 3605000; // 1 hour + 5 seconds
  server.keepAliveTimeout = 65000;
}

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
