import express, { type Request, type Response, type RequestHandler } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { decodeJwtPayload } from "./auth/jwt";
import {
  ALLOWED_EXTENSIONS,
  clearInstallersDirectory,
  ensureInstallersDirectory,
  InstallerMeta,
  INSTALLERS_DIR,
  MAX_INSTALLER_BYTES,
  parseInstallerVersion,
  readLatestMeta,
  resolveInstallerPath,
  writeLatestMeta,
} from "./installersStorage";

type AccessClaims = {
  realm_access?: {
    roles?: string[];
  };
};

const router = express.Router();

ensureInstallersDirectory();

function getRealmRoles(req: Request): string[] {
  const token = req.session?.auth?.tokenSet?.access_token;
  const claims = decodeJwtPayload<AccessClaims>(token);
  return claims?.realm_access?.roles ?? [];
}

function isAdmin(req: Request): boolean {
  return getRealmRoles(req).some((role) => role.toLowerCase().includes("admin"));
}

const requireAdminUpload: RequestHandler = (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(403).json({ error: "Admin role required for uploads" });
    return;
  }
  next();
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, INSTALLERS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `latest-${Date.now()}${ext}`);
  },
});

const upload = multer({
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

router.get("/", (_req: Request, res: Response) => {
  res.json({ installer: readLatestMeta() });
});

router.post(
  "/upload",
  requireAdminUpload,
  (req: Request, res: Response, next) => {
    clearInstallersDirectory();
    upload.single("installer")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          error: err instanceof Error ? err.message : "Installer upload failed",
        });
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No installer file uploaded" });
      return;
    }

    const installer: InstallerMeta = {
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      version: parseInstallerVersion(req.body),
    };

    writeLatestMeta(installer);
    res.status(201).json({ installer });
  }
);

router.delete("/latest", requireAdminUpload, (_req: Request, res: Response) => {
  clearInstallersDirectory();
  res.status(204).end();
});

router.get("/download", (_req: Request, res: Response) => {
  const installer = readLatestMeta();
  if (!installer) {
    res.status(404).json({ error: "No installer available" });
    return;
  }

  const fullPath = resolveInstallerPath(installer);
  if (!fs.existsSync(fullPath)) {
    res.status(404).json({ error: "Installer file not found" });
    return;
  }

  res.download(fullPath, installer.originalName);
});

export default router;
