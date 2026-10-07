import http from "node:http";
import { createAppIos } from "./app-ios";
import { readServerConfigIos } from "./serverEnv-ios";

export async function startServerIos() {
  const config = readServerConfigIos();
  const server = http.createServer(createAppIos());
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(config.port, config.host, () => {
      server.removeListener("error", reject);
      resolve();
    });
  });
  return { server, config };
}

async function main(): Promise<void> {
  const { server, config } = await startServerIos();
  console.log(JSON.stringify({ service: "lis-ios-bootstrap", event: "listening", port: config.port }));
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    // Drain accepted requests. A deadline closes stragglers; no data/receipt cleanup.
    const deadline = setTimeout(() => {
      server.closeAllConnections();
      process.exitCode = 1;
    }, config.shutdownTimeoutMs);
    deadline.unref();
    server.close((error) => {
      clearTimeout(deadline);
      if (error) process.exitCode = 1;
      console.log(JSON.stringify({ service: "lis-ios-bootstrap", event: "stopped" }));
    });
    server.closeIdleConnections();
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
  server.on("error", () => { process.exitCode = 1; stop(); });
}

if (require.main === module) {
  main().catch((error: NodeJS.ErrnoException) => {
    // Never log exception messages, paths, env contents or credentials.
    const code = ["EADDRINUSE", "EACCES"].includes(error.code || "") ? error.code : "startup_failed";
    console.error(JSON.stringify({ service: "lis-ios-bootstrap", event: "startup_failed", code }));
    process.exitCode = 1;
  });
}
