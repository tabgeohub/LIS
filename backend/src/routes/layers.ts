import { Router, type Response } from "express";
import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { requireSessionAuthWithError } from "../helpers/auth/requireSessionAuth";
import {
  getSessionRealmRoles,
  pickRegioRoleFromRealmRoles,
} from "../helpers/queries/shared/resolveRegioFilter";

const router = Router();
const requestIdHeader = "X-LIS-Request-ID";
const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

const layerErrors = {
  LAYER_AUTH_REQUIRED: { status: 401, message: "Authentication required" },
  LAYER_ACCESS_DENIED: { status: 403, message: "A LIS region or admin role is required." },
  LAYER_CATALOG_NOT_FOUND: { status: 404, message: "Layer catalog not found." },
  LAYER_PACKAGE_NOT_FOUND: { status: 404, message: "Layer package not found." },
  LAYER_PACKAGE_MISSING: { status: 404, message: "A published layer package is missing." },
  LAYER_CATALOG_INVALID: { status: 503, message: "Layer catalog is invalid." },
  LAYER_STORAGE_UNAVAILABLE: { status: 503, message: "Layer storage is unavailable." },
} as const;
type LayerErrorCode = keyof typeof layerErrors;
type StorageOperation = "check_directory" | "read_catalog" | "validate_catalog" | "open_package" | "stream_package";
const filesystemCodes = new Set(["EACCES", "EBUSY", "EIO", "ELOOP", "ENETUNREACH", "ENOENT",
  "ENOTCONN", "ENOTDIR", "EPERM", "ESTALE", "ETIMEDOUT"]);

function sendLayerError(res: Response, code: LayerErrorCode): void {
  const { status, message } = layerErrors[code];
  res.status(status).json({ message, code, request_id: res.get(requestIdHeader) });
}

function reportLayerFailure(res: Response, operation: StorageOperation, code: LayerErrorCode, error?: unknown): void {
  const cause = (error as NodeJS.ErrnoException | undefined)?.code;
  console.error("[layers]", {
    request_id: res.get(requestIdHeader),
    operation,
    code,
    cause_code: cause && filesystemCodes.has(cause) ? cause : undefined,
  });
}

router.use((_req, res, next) => {
  res.set(privateHeaders).set(requestIdHeader, randomUUID());
  next();
});

const requireLayerSession = requireSessionAuthWithError((res) => {
  sendLayerError(res, "LAYER_AUTH_REQUIRED");
});

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

async function readCatalog(catalogPath: string): Promise<Buffer | null> {
  const file = await openFile(catalogPath);
  if (!file) return null;
  try {
    return (await file.stat()).isFile() ? await file.readFile() : null;
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
  requireLayerSession, async (req, res) => {
  const { sha256, filename } = req.params;
  const role = pickRegioRoleFromRealmRoles(getSessionRealmRoles(req));
  const region = role === "admin" ? role : /^(?:RWS|EXT)\s+([A-Za-z0-9]+)$/.exec(role?.trim() ?? "")?.[1].toUpperCase();
  if (!region) {
    sendLayerError(res, "LAYER_ACCESS_DENIED");
    return;
  }
  if (filename !== undefined && !validVersion(sha256, filename)) {
    sendLayerError(res, "LAYER_PACKAGE_NOT_FOUND");
    return;
  }

  const sharePath = process.env.LIS_SHARE_PATH?.trim() || "/mnt/lis-share";
  const layersPath = path.resolve(sharePath, "Layers");
  let operation: StorageOperation = "check_directory";

  try {
    if (!(await lstat(layersPath)).isDirectory()) {
      throw new Error("Layers path is not a directory.");
    }

    operation = "read_catalog";
    const data = await readCatalog(path.join(layersPath, "layers.json"));
    if (!data) {
      reportLayerFailure(res, operation, "LAYER_CATALOG_NOT_FOUND");
      sendLayerError(res, "LAYER_CATALOG_NOT_FOUND");
      return;
    }

    operation = "validate_catalog";
    const catalog = decodeCatalog(data);
    const visibleLayers = role === "admin" ? catalog : catalog.filter((layer) => layer.regio.includes(region));
    if (filename === undefined) {
      res.json({ layers: visibleLayers });
      return;
    }

    const layer = visibleLayers.find((entry) => entry.name === filename && entry.sha256 === sha256);
    if (!layer) {
      sendLayerError(res, "LAYER_PACKAGE_NOT_FOUND");
      return;
    }

    operation = "open_package";
    const file = await openPackage(layersPath, layer);
    if (!file) {
      reportLayerFailure(res, operation, "LAYER_PACKAGE_MISSING");
      sendLayerError(res, "LAYER_PACKAGE_MISSING");
      return;
    }

    try {
      const stats = await file.stat();
      if (!stats.isFile()) {
        reportLayerFailure(res, operation, "LAYER_PACKAGE_MISSING");
        sendLayerError(res, "LAYER_PACKAGE_MISSING");
        return;
      }
      res.type("application/octet-stream").set("Content-Length", String(stats.size));
      if (req.method === "HEAD") {
        res.end();
        return;
      }

      operation = "stream_package";
      await pipeline(file.createReadStream({ autoClose: false }), res);
    } finally {
      await file.close();
    }
  } catch (error) {
    if (operation === "stream_package" && (error as NodeJS.ErrnoException)?.code === "ERR_STREAM_PREMATURE_CLOSE") {
      return;
    }
    const code = operation === "validate_catalog" ? "LAYER_CATALOG_INVALID" : "LAYER_STORAGE_UNAVAILABLE";
    reportLayerFailure(res, operation, code, error);
    if (!res.headersSent && !res.destroyed) {
      res.removeHeader("Content-Length");
      sendLayerError(res, code);
    }
  }
});

export default router;
