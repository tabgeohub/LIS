import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const localApiBase =
  process.env.PUBLIC_APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
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
    },
    servers: [
      {
        url: `${localApiBase}/api`,
        description: "Local / current environment",
      },
      {
        url: "https://tst-lis.rws.nl/backend/api",
        description: "Test (tst-lis)",
      },
    ],
    tags: [
      { name: "FlightPlans", description: "Active flight plans (Voorbereiding)" },
      { name: "FinishedPlans", description: "Finished / executed flight plans (Nabewerking)" },
      { name: "Points", description: "Aandachtspunten" },
      { name: "Geometries", description: "Lines and polygons" },
      { name: "TemplatePlans", description: "Template flight plans" },
      { name: "Timeslider", description: "Nabewerking timeslider & plan images" },
      { name: "Consts", description: "Lookup tables (regios, piloten, …)" },
      { name: "Users", description: "User management" },
      { name: "Emails", description: "Email templates & sending" },
      { name: "Auth", description: "Legacy login (Keycloak used in production)" },
    ],
    security: [{ sessionCookie: [] }],
  },
  apis: ["./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.get("/docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "LIS API Docs",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
      },
    })
  );
};
