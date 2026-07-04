import multer from "multer";
import path from "path";
import {
  ALLOWED_EXTENSIONS,
  INSTALLERS_DIR,
  MAX_INSTALLER_BYTES,
} from "./installersStorage";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, INSTALLERS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `latest-${Date.now()}${ext}`);
  },
});

export const installerUpload = multer({
  storage,
  limits: { fileSize: MAX_INSTALLER_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      cb(new Error("Only .exe, .msi, and .zip files are allowed"));
      return;
    }
    cb(null, true);
  },
});
