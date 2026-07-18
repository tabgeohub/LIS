export function resolveSwaggerLocalApiBase(
  env: NodeJS.ProcessEnv = process.env
): string {
  return env.PUBLIC_APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";
}

export function buildSwaggerServers(localApiBase: string) {
  return [
    {
      url: `${localApiBase}/api`,
      description: "Local / current environment",
    },
    {
      url: "https://tst-lis.rws.nl/backend/api",
      description: "Test (tst-lis)",
    },
  ];
}
