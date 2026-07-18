import type { Server } from "http";

export function attachListenErrorHandler(
  server: Server,
  port: number
): void {
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
}

export function configureServerTimeouts(server: Server): void {
  server.requestTimeout = 3600000; // 1 hour
  server.headersTimeout = 3605000; // 1 hour + 5 seconds
  server.keepAliveTimeout = 65000;
}
