import express, { type Request, type Response } from "express";
import {
  clearInstallersDirectory,
  ensureInstallersDirectory,
  readLatestMeta,
} from "./installersStorage";
import { createRequireAdmin } from "../helpers/auth/realmAdminAuth";
import {
  handleInstallerDownload,
  handleInstallerUploadComplete,
  handleInstallerUploadMiddleware,
} from "./installersHandlers";

const router = express.Router();
const requireAdminUpload = createRequireAdmin("Admin role required for uploads");

ensureInstallersDirectory();

router.get("/", (_req: Request, res: Response) => {
  res.json({ installer: readLatestMeta() });
});

router.post(
  "/upload",
  requireAdminUpload,
  handleInstallerUploadMiddleware,
  handleInstallerUploadComplete
);

router.delete("/latest", requireAdminUpload, (_req: Request, res: Response) => {
  clearInstallersDirectory();
  res.status(204).end();
});

router.get("/download", handleInstallerDownload);

export default router;
