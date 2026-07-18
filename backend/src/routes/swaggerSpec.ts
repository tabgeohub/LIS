import swaggerJSDoc from "swagger-jsdoc";
import { buildSwaggerOptions } from "./swaggerOptions";

export const swaggerSpec = swaggerJSDoc(buildSwaggerOptions());
