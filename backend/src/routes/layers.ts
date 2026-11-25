import { Router } from "express";
import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";
import {
  getSessionRealmRoles,
  pickRegioRoleFromRealmRoles,
} from "../helpers/queries/shared/resolveRegioFilter";

const router = Router();
const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

type Layer = {
  name: string;
  url: string;
  regio: string[];
  last_update_date: string;
  sha256: string;
};

function validVersion(sha: unknown, filename: unknown): boolean {
  return typeof sha === "string" && sha.length === 64 && /^[0-9a-f]+$/.test(sha) &&
    typeof filename === "string" && filename.endsWith(".tpkx") &&
    /^[A-Za-z0-9][A-Za-z0-9._-]*\.tpkx$/.test(filename);
}

function decodeCatalog(data: Buffer): Layer[] {
  const catalog = JSON.parse(data.toString("utf8"));
  if (!Array.isArray(catalog?.layers)) throw new Error("Layer catalog must contain a layers array.");

  const names = new Set<string>();
  return catalog.layers.map((entry: unknown) => {
    if (!entry || typeof entry !== "object") throw new Error("Invalid catalog entry.");
    const { name, url, regio, last_update_date, sha256 } = entry as Partial<Layer>;
    if (
      typeof name !== "string" || typeof sha256 !== "string" || !validVersion(sha256, name) ||
      names.has(name.toLowerCase()) || url !== `packages/${sha256}/${name}` ||
      !Array.isArray(regio) || !regio.length || new Set(regio).size !== regio.length ||
      !regio.every((value) => typeof value === "string" && /^[A-Z0-9]+$/.test(value) && value.trim() === value) ||
      typeof last_update_date !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(last_update_date) ||
      new Date(last_update_date).toISOString() !== last_update_date.replace("Z", ".000Z")
    ) throw new Error("Invalid catalog entry.");

    names.add(name.toLowerCase());
    return { name, url, regio, last_update_date, sha256 };
  });
}

function isMissing(error: unknown): boolean {
  const { code } = error as NodeJS.ErrnoException;
  return code === "ENOENT" || code === "ELOOP";
}

async function openFile(filePath: string) {
  try {
    if (!(await lstat(filePath)).isFile()) return null;

    const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0);
    return await open(filePath, flags);
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

async function readCatalog(catalogPath: string): Promise<Layer[] | null> {
  const file = await openFile(catalogPath);
  if (!file) return null;
  try {
    return (await file.stat()).isFile() ? decodeCatalog(await file.readFile()) : null;
  } finally {
    await file.close();
  }
}

async function openPackage(layersPath: string, layer: Layer) {
  const packagesPath = path.join(layersPath, "layers_tpkx");
  const versionPath = path.join(packagesPath, layer.sha256);
  try {
    if (!(await lstat(packagesPath)).isDirectory() || !(await lstat(versionPath)).isDirectory()) return null;
    return await openFile(path.join(versionPath, layer.name));
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

router.get<{ sha256?: string; filename?: string }>(["/layers.json", "/packages/:sha256/:filename"],
  requireSessionAuth, async (req, res) => {
  res.set(privateHeaders);
  const { sha256, filename } = req.params;
  const role = pickRegioRoleFromRealmRoles(getSessionRealmRoles(req));
  const region = role === "admin" ? role : /^(?:RWS|EXT)\s+([A-Za-z0-9]+)$/.exec(role?.trim() ?? "")?.[1].toUpperCase();
  if (!region) {
    res.status(403).json({ message: "A LIS region or admin role is required." });
    return;
  }
  if (filename !== undefined && !validVersion(sha256, filename)) {
    res.status(404).json({ message: "Layer package not found." });
    return;
  }

  const sharePath = process.env.LIS_SHARE_PATH?.trim() || "/mnt/lis-share";
  const layersPath = path.resolve(sharePath, "Layers");

  try {
    if (!(await lstat(layersPath)).isDirectory()) {
      throw new Error("Layers path is not a directory.");
    }

    const catalog = await readCatalog(path.join(layersPath, "layers.json"));
    if (!catalog) {
      res.status(404).json({ message: "Layer catalog not found." });
      return;
    }

    const visibleLayers = role === "admin" ? catalog : catalog.filter((layer) => layer.regio.includes(region));
    if (filename === undefined) {
      res.json({ layers: visibleLayers });
      return;
    }

    const layer = visibleLayers.find((entry) => entry.name === filename && entry.sha256 === sha256);
    const file = layer && await openPackage(layersPath, layer);
    if (!file) {
      res.status(404).json({ message: "Layer package not found." });
      return;
    }

    try {
      const stats = await file.stat();
      if (!stats.isFile()) {
        res.status(404).json({ message: "Layer package not found." });
        return;
      }
      res.type("application/octet-stream").set("Content-Length", String(stats.size));
      if (req.method === "HEAD") {
        res.end();
        return;
      }

      await pipeline(file.createReadStream({ autoClose: false }), res);
    } finally {
      await file.close();
    }
  } catch {
    if (!res.headersSent && !res.destroyed) {
      res.status(503).json({ message: "Layer storage is unavailable." });
    }
  }
});

export default router;
