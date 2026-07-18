export function buildSwaggerInfo() {
  return {
    title: "LIS API",
    version: "1.0.0",
    description: [
      "API documentation for the LIS backend.",
      "",
      "**Authentication:** Most `/api/*` routes require a Keycloak session cookie (`lis.sid`).",
      "Log in via the LIS app first (e.g. http://localhost:3000), then open this page on the **same backend host** (http://localhost:5000/docs).",
      "",
      "**Regio filtering:** Non-admin users are always filtered to their Keycloak session role (RWS/EXT regio).",
      "Admin users see all regios unless `regio_id` or `regio` is passed to filter.",
      "Swagger query params are optional for non-admin — session role is applied automatically.",
    ].join("\n"),
  };
}
