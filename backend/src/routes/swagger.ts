import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LIS API",
      version: "1.0.0",
      description: "API documentation for LIS backend",
    },
    servers: [
      {
        url: "https://tst-lis.rws.nl/backend/api",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts", "./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
