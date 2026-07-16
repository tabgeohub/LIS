import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";
import { isAllowedCorsOrigin } from "../helpers/cors/allowedOrigins";
import { createSessionMiddleware } from "../helpers/session/createSessionMiddleware";
import arcgisPostProxyHandler from "../routes/arcgis/postProxyHandler";
import { LIS_CLIENT_HEADER } from "../routes/auth2/authClientHeader";
import { setupSwagger } from "../routes/swagger";

function requestSizeLimits() {
  return {
    json: process.env.JSON_LIMIT || "20gb",
    urlEncoded: process.env.URLENC_LIMIT || "20gb",
    parameters: parseInt(process.env.PARAM_LIMIT || "1000000", 10),
  };
}

export async function configureRequestMiddleware(app: Express) {
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, isAllowedCorsOrigin(origin)),
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Accept",
        "Authorization",
        LIS_CLIENT_HEADER,
        "X-LIS-Client",
      ],
    })
  );
  app.set("trust proxy", 1);
  app.use(cookieParser());
  app.use(await createSessionMiddleware());

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
