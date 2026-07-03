import fs from "fs";
import path from "path";

export type InstallerMeta = {
  originalName: string;
  savedAs: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  version: string | null;
};

export const INSTALLERS_DIR = path.join(__dirname, "..", "installers");
export const META_PATH = path.join(INSTALLERS_DIR, "latest.json");
export const MAX_INSTALLER_BYTES = 1024 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = new Set([".exe", ".msi", ".zip"]);

export function ensureInstallersDirectory(): void {
  if (!fs.existsSync(INSTALLERS_DIR)) {
    fs.mkdirSync(INSTALLERS_DIR, { recursive: true });
  }
}

export function clearInstallersDirectory(): void {
  if (!fs.existsSync(INSTALLERS_DIR)) return;

  for (const entry of fs.readdirSync(INSTALLERS_DIR)) {
    const fullPath = path.join(INSTALLERS_DIR, entry);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

export function readLatestMeta(): InstallerMeta | null {
  if (!fs.existsSync(META_PATH)) return null;
  const raw = fs.readFileSync(META_PATH, "utf-8");
  const parsed = JSON.parse(raw) as InstallerMeta;
  const absolutePath = path.join(INSTALLERS_DIR, parsed.savedAs);
  if (!fs.existsSync(absolutePath)) return null;
  return parsed;
}

export function writeLatestMeta(installer: InstallerMeta): void {
  fs.writeFileSync(META_PATH, JSON.stringify(installer, null, 2), "utf-8");
}

export function resolveInstallerPath(installer: InstallerMeta): string {
  return path.join(INSTALLERS_DIR, installer.savedAs);
}

export function parseInstallerVersion(body: unknown): string | null {
  return typeof (body as { version?: string })?.version === "string" &&
    (body as { version: string }).version.trim() !== ""
    ? (body as { version: string }).version.trim()
    : null;
}
