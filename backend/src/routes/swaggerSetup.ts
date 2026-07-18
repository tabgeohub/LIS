import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swaggerSpec";

const swaggerUiOptions = {
  customSiteTitle: "LIS API Docs",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
    docExpansion: "list",
    defaultModelsExpandDepth: 1,
  },
};

export const setupSwagger = (app: Express) => {
  app.get("/docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
};
