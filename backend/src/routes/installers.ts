import express, { type Request, type Response, type RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { decodeJwtPayload } from "./auth/jwt";

type AccessClaims = {
  realm_access?: {
    roles?: string[];
  };
};

type InstallerMeta = {
  originalName: string;
  savedAs: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  version: string | null;
};

const router = express.Router();

const INSTALLERS_DIR = path.join(__dirname, "..", "installers");
const META_PATH = path.join(INSTALLERS_DIR, "latest.json");
const MAX_INSTALLER_BYTES = 1024 * 1024 * 1024; // 1 GB
const ALLOWED_EXTENSIONS = new Set([".exe", ".msi", ".zip"]);

if (!fs.existsSync(INSTALLERS_DIR)) {
  fs.mkdirSync(INSTALLERS_DIR, { recursive: true });
}

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

function clearInstallersDirectory(): void {
  if (!fs.existsSync(INSTALLERS_DIR)) return;

  for (const entry of fs.readdirSync(INSTALLERS_DIR)) {
    const fullPath = path.join(INSTALLERS_DIR, entry);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

function readLatestMeta(): InstallerMeta | null {
  if (!fs.existsSync(META_PATH)) return null;
  const raw = fs.readFileSync(META_PATH, "utf-8");
  const parsed = JSON.parse(raw) as InstallerMeta;
  const absolutePath = path.join(INSTALLERS_DIR, parsed.savedAs);
  if (!fs.existsSync(absolutePath)) return null;
  return parsed;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, INSTALLERS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `latest-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_INSTALLER_BYTES,
    files: 1,
  },
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
  const installer = readLatestMeta();
  res.json({ installer });
});

router.post(
  "/upload",
  requireAdminUpload,
  (req: Request, res: Response, next) => {
    clearInstallersDirectory();
    upload.single("installer")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          error:
            err instanceof Error
              ? err.message
              : "Installer upload failed",
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

    const version =
      typeof req.body?.version === "string" && req.body.version.trim() !== ""
        ? req.body.version.trim()
        : null;

    const installer: InstallerMeta = {
      originalName: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      version,
    };

    fs.writeFileSync(META_PATH, JSON.stringify(installer, null, 2), "utf-8");
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

  const fullPath = path.join(INSTALLERS_DIR, installer.savedAs);
  if (!fs.existsSync(fullPath)) {
    res.status(404).json({ error: "Installer file not found" });
    return;
  }

  res.download(fullPath, installer.originalName);
});

export default router;
