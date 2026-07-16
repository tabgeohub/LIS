import type { Express } from "express";
import { configureRequestMiddleware } from "./configure/configureRequestMiddleware";
import { registerApplicationRoutes } from "./configure/registerApplicationRoutes";
import { createAuth2Router } from "./routes/auth2";

export async function configureExpressApp(app: Express) {
  await configureRequestMiddleware(app);
  registerApplicationRoutes(app, await createAuth2Router());
}
