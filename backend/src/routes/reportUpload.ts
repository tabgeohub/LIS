import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { mapMulterError } from "../helpers/uploads/multerErrorMessage";
import { buildReportUploadResponse } from "../helpers/uploads/reportUploadResponse";

const router = express.Router();

const UPLOAD_ROOT = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname || "") || "").toLowerCase();
    const uuid = crypto.randomUUID();
    const safeExt = ext === ".zip" ? ".zip" : "";
    cb(null, `${Date.now()}-${uuid}${safeExt}`);
  },
});

const fileFilter = (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = (path.extname(file.originalname || "") || "").toLowerCase();
  if (ext === ".zip") return cb(null, true);
  cb(new Error("Only .zip files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_BYTES || 20 * 1024 * 1024 * 1024),
    files: 1,
    parts: 2000,
  },
});

type SendErrorInput = {
  res: express.Response;
  status: number;
  message: string;
  extra?: Record<string, unknown>;
};

function sendError(input: SendErrorInput) {
  const { res, status, message, extra = {} } = input;
  const body: Record<string, unknown> = { error: message, ...extra };
  if (process.env.NODE_ENV !== "production" && extra.stack) {
    body.stack = String(extra.stack).split("\n").slice(0, 6).join("\n");
  }
  return res.status(status).json(body);
}

router.post("/", (req, res, next) => {
  // @ts-ignore
  res.setTimeout(3600000);
  upload.single("report")(req, res, (err) => {
    if (err) {
      return sendError({
        res,
        status: 400,
        message: mapMulterError(err),
        extra: { code: (err as multer.MulterError).code, stack: (err as Error).stack || "" },
      });
    }

    if (!req.file) {
      return sendError({ res, status: 400, message: "No file uploaded" });
    }

    try {
      return res.json(buildReportUploadResponse(req.file));
    } catch (e) {
      return next(e);
    }
  });
});

export function uploadErrorHandler(
  err: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  if (err instanceof multer.MulterError) {
    return sendError({
      res,
      status: 400,
      message: mapMulterError(err),
      extra: { code: err.code, stack: err.stack || "" },
    });
  }
  return sendError({
    res,
    status: 500,
    message: "Failed to upload report",
    extra: { stack: (err as Error).stack || "" },
  });
}

export default router;
