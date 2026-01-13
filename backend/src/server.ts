import app from "./app";

// Validate required environment variables
const requiredEnvVars = [
  "SESSION_SECRET",
  "PGUSER",
  "PGHOST",
  "PGDATABASE",
  "PGPASSWORD",
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

const port = Number(process.env.PORT || 5000);

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
