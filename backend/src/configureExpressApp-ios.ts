import type { Express } from "express";
import { configureRequestMiddlewareIos } from "./configure/configureRequestMiddleware-ios";
import { registerApplicationRoutesIos } from "./configure/registerApplicationRoutes-ios";

export function configureExpressAppIos(app: Express): void {
  configureRequestMiddlewareIos(app);
  // Step 06 must add/await native session middleware BEFORE its auth/business routers.
  // The Step 05 public probe intentionally opens no session/DB/ArcGIS resources.
  registerApplicationRoutesIos(app);
}
