import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import flightPlansRouter from "./routes/flightPlans";
import pointsRouter from "./routes/points";
import emailsRouter from "./routes/emails";
import finishedPlansRouter from "./routes/finished_plans";
import templateFlightsRouter from "./routes/template_plans";
import authRouter from "./routes/auth";
import fileDownloadRouter from "./routes/fileDownload";
import directDownloadRouter from "./routes/directDownload";
import main from "./routes/main";
import logsRouter from "./routes/logs";
import { setupSwagger } from "./routes/swagger";
import authKeycloak from "./routes/auth/authKeycloak";
import keycloakRouter from "./routes/keycloak";
import constsRouter from "./routes/consts";
import reportUploadRouter from "./routes/reportUpload";
import geometriesRouter from "./routes/geometries";
import timesliderRouter from "./routes/timeslider";
import arcgisRouter from "./routes/arcgis";
import { requirePassword, uploadsDir } from "./helpers/requirePassword";
import { requireSessionAuth } from "./helpers/requireSessionAuth";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

/** ---------- CORS ---------- */
const allowedOrigins = new Set([
  process.env.PUBLIC_FRONTEND_URL!,
  process.env.INTRANET_FRONTEND_URL!,
  "http://localhost:3000",
  "http://localhost:5173",
  "app://.",
]);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, false); // non-CORS requests
      if (origin === "null") return cb(null, true); // Electron file://
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  })
);

/** ---------- Sessions ---------- */
app.set("trust proxy", 1);
app.use(cookieParser());

const isHttps = (process.env.PUBLIC_APP_BASE_URL || "").startsWith("https");

app.use(
  session({
    name: "lis.sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isHttps ? "none" : "lax",
      secure: isHttps,
      maxAge: 60 * 60 * 1000,
    },
  })
);

/** ---------- Body parsers ---------- */
const JSON_LIMIT = process.env.JSON_LIMIT || "20gb"; // large but finite
const URLENC_LIMIT = process.env.URLENC_LIMIT || "20gb"; // large but finite
const PARAM_LIMIT = parseInt(process.env.PARAM_LIMIT || "1000000", 10); // many fields

app.use(express.json({ limit: JSON_LIMIT }));
app.use(
  express.urlencoded({
    limit: URLENC_LIMIT,
    extended: true,
    parameterLimit: PARAM_LIMIT,
  })
);

setupSwagger(app);

/** ---------- Routes ---------- */
app.use("/", main);
app.use("/auth", authKeycloak);
app.use("/api/keycloak", requireSessionAuth, keycloakRouter);
app.use("/api/auth", requireSessionAuth, authRouter);
app.use("/api/users", requireSessionAuth, usersRouter);
app.use("/api/flightPlans", requireSessionAuth, flightPlansRouter);
app.use("/api/points", requireSessionAuth, pointsRouter);
app.use("/api/emails", requireSessionAuth, emailsRouter);
app.use("/api/finished_plans", requireSessionAuth, finishedPlansRouter);
app.use("/api/templateFlight", requireSessionAuth, templateFlightsRouter);
app.use("/api/logs", requireSessionAuth, logsRouter);
app.use("/api/consts", requireSessionAuth, constsRouter);
app.use("/api/geometries", requireSessionAuth, geometriesRouter);
app.use("/api/timeslider", requireSessionAuth, timesliderRouter);
app.use("/api/arcgis", arcgisRouter);

/** ---------- Static + Upload/Download ---------- */
// If you have a gated file browser, keep this; otherwise rely on /api/file-download
app.use("/uploads", requirePassword, express.static(uploadsDir));

// Upload endpoint (now session-authenticated; route keeps type/size filtering)
app.use("/api/upload-report", requireSessionAuth, reportUploadRouter);

// Password-gated download flow
app.use("/api/file-download", requireSessionAuth, fileDownloadRouter);

// Direct download (session-authenticated)
app.use("/api/direct-download", requireSessionAuth, directDownloadRouter);

export default app;
