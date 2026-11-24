import { Router } from "express";
import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import path from "node:path";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";

const router = Router();

async function readCatalog(catalogPath: string): Promise<Buffer | null> {
  try {
    if (!(await lstat(catalogPath)).isFile()) return null;

    const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0);
    const file = await open(catalogPath, flags);
    try {
      if (!(await file.stat()).isFile()) return null;
      return await file.readFile();
    } finally {
      await file.close();
    }
  } catch (error) {
    const { code } = error as NodeJS.ErrnoException;
    if (code === "ENOENT" || code === "ELOOP") return null;
    throw error;
  }
}

router.get("/layers.json", requireSessionAuth, async (_req, res) => {
  const sharePath = process.env.LIS_SHARE_PATH?.trim() || "/mnt/lis-share";
  const layersPath = path.resolve(sharePath, "Layers");

  let catalog: Buffer | null;
  try {
    if (!(await lstat(layersPath)).isDirectory()) {
      throw new Error("Layers path is not a directory.");
    }
    catalog = await readCatalog(path.join(layersPath, "layers.json"));
  } catch {
    res.status(503).json({ message: "Layer storage is unavailable." });
    return;
  }

  if (catalog === null) {
    res.status(404).json({ message: "Layer catalog not found." });
    return;
  }

  res.set({
    "Content-Type": "application/json",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  }).send(catalog);
});

export default router;
