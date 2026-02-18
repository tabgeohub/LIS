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
import { requirePassword, uploadsDir } from "./helpers/requirePassword";
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
app.use("/api/keycloak", keycloakRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/flightPlans", flightPlansRouter);
app.use("/api/points", pointsRouter);
app.use("/api/emails", emailsRouter);
app.use("/api/finished_plans", finishedPlansRouter);
app.use("/api/templateFlight", templateFlightsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/consts", constsRouter);
app.use("/api/geometries", geometriesRouter);

/** ---------- Static + Upload/Download ---------- */
// If you have a gated file browser, keep this; otherwise rely on /api/file-download
app.use("/uploads", requirePassword, express.static(uploadsDir));

// Public upload endpoint (secured in reportUpload with type/size filter)
app.use("/api/upload-report", reportUploadRouter);

// Password-gated download flow
app.use("/api/file-download", fileDownloadRouter);

// Direct download (no password gate)
app.use("/api/direct-download", directDownloadRouter);

export default app;
