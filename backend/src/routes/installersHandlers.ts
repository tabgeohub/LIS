import type { Request, Response } from "express";
import fs from "fs";
import {
  clearInstallersDirectory,
  InstallerMeta,
  parseInstallerVersion,
  readLatestMeta,
  resolveInstallerPath,
  writeLatestMeta,
} from "./installersStorage";
import { installerUpload } from "./installersUpload";

export function handleInstallerUploadMiddleware(
  req: Request,
  res: Response,
  next: (err?: unknown) => void
) {
  clearInstallersDirectory();
  installerUpload.single("installer")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err instanceof Error ? err.message : "Installer upload failed",
      });
    }
    next();
  });
}

export function handleInstallerUploadComplete(req: Request, res: Response) {
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

export function handleInstallerDownload(_req: Request, res: Response) {
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
}
