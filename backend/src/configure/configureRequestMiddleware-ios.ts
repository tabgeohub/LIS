import express, { Express } from "express";
import { configureCorsMiddleware } from "./configureCorsMiddleware";

export function configureRequestMiddlewareIos(app: Express): void {
  app.disable("x-powered-by");
  // Probe needs no forwarded identity, secure-cookie decision or client IP trust.
  app.set("trust proxy", false);
  app.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
  configureCorsMiddleware(app); // Unchanged website/Desktop origin allowlist.
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ limit: "16kb", extended: false, parameterLimit: 100 }));
}
