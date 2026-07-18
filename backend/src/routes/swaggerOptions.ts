import type swaggerJSDoc from "swagger-jsdoc";
import { buildSwaggerInfo } from "./swaggerInfo";
import {
  buildSwaggerServers,
  resolveSwaggerLocalApiBase,
} from "./swaggerServers";
import { swaggerTags } from "./swaggerTags";

export function buildSwaggerOptions(): swaggerJSDoc.Options {
  const localApiBase = resolveSwaggerLocalApiBase();
  return {
    definition: {
      openapi: "3.0.0",
      info: buildSwaggerInfo(),
      servers: buildSwaggerServers(localApiBase),
      tags: swaggerTags,
      security: [{ sessionCookie: [] }],
    },
    apis: ["./src/docs/**/*.ts"],
  };
}
