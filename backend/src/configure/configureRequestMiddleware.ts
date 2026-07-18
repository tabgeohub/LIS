import cookieParser from "cookie-parser";
import { Express } from "express";
import { createSessionMiddleware } from "../helpers/session/createSessionMiddleware";
import { configureBodyParsersAndSwagger } from "./configureBodyParsersAndSwagger";
import { configureCorsMiddleware } from "./configureCorsMiddleware";

export async function configureRequestMiddleware(app: Express) {
  configureCorsMiddleware(app);
  app.set("trust proxy", 1);
  app.use(cookieParser());
  app.use(await createSessionMiddleware());
  configureBodyParsersAndSwagger(app);
}
