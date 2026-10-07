import express from "express";
import { configureExpressAppIos } from "./configureExpressApp-ios";

export function createAppIos() {
  const app = express();
  configureExpressAppIos(app);
  return app;
}
