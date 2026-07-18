import express, { Express } from "express";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";
import arcgisPostProxyHandler from "../routes/arcgis/postProxyHandler";
import { setupSwagger } from "../routes/swagger";

function requestSizeLimits() {
  return {
    json: process.env.JSON_LIMIT || "20gb",
    urlEncoded: process.env.URLENC_LIMIT || "20gb",
    parameters: parseInt(process.env.PARAM_LIMIT || "1000000", 10),
  };
}

export function configureBodyParsersAndSwagger(app: Express) {
  const limits = requestSizeLimits();
  app.post(
    "/api/arcgis/proxy",
    requireSessionAuth,
    express.raw({ type: () => true, limit: limits.urlEncoded }),
    arcgisPostProxyHandler
  );
  app.use(express.json({ limit: limits.json }));
  app.use(
    express.urlencoded({
      limit: limits.urlEncoded,
      extended: true,
      parameterLimit: limits.parameters,
    })
  );
  setupSwagger(app);
}
