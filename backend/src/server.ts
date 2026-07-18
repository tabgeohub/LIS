import app, { appReady } from "./app";
import { assertRequiredEnvVars, warnIfHttpsWithoutProduction } from "./serverEnv";
import { attachListenErrorHandler, configureServerTimeouts } from "./serverListen";

assertRequiredEnvVars();
warnIfHttpsWithoutProduction();

const port = Number(process.env.PORT || 5000);

async function startServer() {
  await appReady;

  const server = app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  attachListenErrorHandler(server, port);
  configureServerTimeouts(server);
}

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
