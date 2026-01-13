import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

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

const fileFilter = (_req: any, file: any, cb: any) => {
  const ext = (path.extname(file.originalname || "") || "").toLowerCase();
  if (ext === ".zip") return cb(null, true);
  cb(new Error("Only .zip files are allowed"));
};

// Enforce explicit limits to fail fast on oversize payloads (infra must match or exceed)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_BYTES || 20 * 1024 * 1024 * 1024), // default 20GB
    files: 1,
    parts: 2000,
  },
});

function sendError(res: any, status: any, message: any, extra: any = {}) {
  const body = { error: message, ...extra };
  if (process.env.NODE_ENV !== "production" && extra.stack) {
    body.stack = extra.stack.split("\n").slice(0, 6).join("\n");
  }
  return res.status(status).json(body);
}

function mapMulterError(err: any) {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_UNEXPECTED_FILE":
        return "Unexpected file field.";
      case "LIMIT_FILE_COUNT":
        return "Too many files. Only one file is allowed.";
      case "LIMIT_PART_COUNT":
      case "LIMIT_FIELD_KEY":
      case "LIMIT_FIELD_VALUE":
      case "LIMIT_FIELD_COUNT":
        return "Form fields exceeded limits.";
      default:
        return `Upload failed: ${err.code}`;
    }
  }
  return err.message || "Upload failed";
}

router.post("/", (req, res, next) => {
  // Allow slow networks for this route
  // @ts-ignore
  res.setTimeout(3600000); // 1 hour
  upload.single("report")(req, res, (err) => {
    if (err) {
      const message = mapMulterError(err);
      return sendError(res, 400, message, {
        code: err.code,
        stack: err.stack || "",
      });
    }

    if (!req.file) {
      return sendError(res, 400, "No file uploaded");
    }

    try {
      const baseUrl =
        process.env.PUBLIC_APP_BASE_URL ||
        process.env.REACT_APP_EXTERNAL_BACKEND_URL ||
        "http://localhost:5000";

      const downloadUrl = `${baseUrl.replace(
        /\/+$/,
        ""
      )}/api/file-download/${encodeURIComponent(req.file.filename)}`;

      return res.json({
        url: downloadUrl,
        file: {
          name: req.file.originalname,
          savedAs: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (e) {
      return next(e);
    }
  });
});

export function uploadErrorHandler(err: any, _req: any, res: any, _next: any) {
  if (err instanceof multer.MulterError) {
    const message = mapMulterError(err);
    return sendError(res, 400, message, {
      code: err.code,
      stack: err.stack || "",
    });
  }
  return sendError(res, 500, "Failed to upload report", {
    stack: err.stack || "",
  });
}

export default router;
