import express, { Express, Router, type RequestHandler } from "express";
import { legacyAuthUsageMonitor } from "../helpers/auth/legacyAuthUsageMonitor";
import { requirePassword, uploadsDir } from "../helpers/auth/requirePassword";
import { rejectViewerMutations } from "../helpers/auth/rejectViewerMutations";
import { requireSessionAuthWritable } from "../helpers/auth/requireSessionAuthWritable";
import arcgisRouter from "../routes/arcgis";
import authRouter from "../routes/auth";
import authKeycloak from "../routes/auth/authKeycloak";
import constsRouter from "../routes/consts";
import devicesUpdatesRouter from "../routes/devices-updates";
import directDownloadRouter from "../routes/directDownload";
import emailsRouter from "../routes/emails";
import fileDownloadRouter from "../routes/fileDownload";
import finishedPlansRouter from "../routes/finished_plans";
import flightPlansRouter from "../routes/flightPlans";
import geometriesRouter from "../routes/geometries";
import installersRouter from "../routes/installers";
import keycloakRouter from "../routes/keycloak";
import logsRouter from "../routes/logs";
import main from "../routes/main";
import pointsRouter from "../routes/points";
import reportUploadRouter from "../routes/reportUpload";
import templateFlightsRouter from "../routes/template_plans";
import timesliderRouter from "../routes/timeslider";
import usersRouter from "../routes/users";

const writable = requireSessionAuthWritable;

/** Apply viewer write-block when a browser session exists (agent routes keep working). */
const rejectViewerMutationsIfSession: RequestHandler = (req, res, next) => {
  if (!req.session?.auth?.tokenSet?.access_token) {
    next();
    return;
  }
  return rejectViewerMutations(req, res, next);
};

/** Mount HTTP routes. OpenAPI coverage lives in `backend/src/docs/*.docs.ts`. */
export function registerApplicationRoutes(app: Express, auth2Router: Router) {
  app.use(legacyAuthUsageMonitor);
  // Public / auth entrypoints
  app.use("/", main);
  app.use("/auth", authKeycloak);
  app.use("/auth2", auth2Router);
  // Session-protected APIs (writes blocked for intern / viewer-only)
  app.use("/api/keycloak", ...writable, keycloakRouter);
  app.use("/api/auth", ...writable, authRouter);
  app.use("/api/users", ...writable, usersRouter);
  app.use("/api/flightPlans", ...writable, flightPlansRouter);
  app.use("/api/points", ...writable, pointsRouter);
  app.use("/api/emails", ...writable, emailsRouter);
  app.use("/api/finished_plans", ...writable, finishedPlansRouter);
  app.use("/api/templateFlight", ...writable, templateFlightsRouter);
  app.use("/api/logs", ...writable, logsRouter);
  app.use("/api/consts", ...writable, constsRouter);
  app.use("/api/geometries", ...writable, geometriesRouter);
  app.use("/api/timeslider", ...writable, timesliderRouter);
  app.use("/api/arcgis", ...writable, arcgisRouter);
  app.use("/uploads", requirePassword, express.static(uploadsDir));
  app.use("/api/upload-report", ...writable, reportUploadRouter);
  app.use("/api/file-download", fileDownloadRouter);
  app.use("/api/direct-download", directDownloadRouter);
  app.use("/api/installers", ...writable, installersRouter);
  app.use(
    "/api/devices-updates",
    rejectViewerMutationsIfSession,
    devicesUpdatesRouter
  );
}
