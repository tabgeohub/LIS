import { Router } from "express";
import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";

const router = Router();
const pictureTypes = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
]);
const invalidFilenameCharacters = /[\\/:\x00-\x1f\x7f]/;

async function openPicture(filePath: string) {
  try {
    if (!(await lstat(filePath)).isFile()) return null;

    const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0);
    return await open(filePath, flags);
  } catch (error) {
    const { code } = error as NodeJS.ErrnoException;
    if (code === "ENOENT" || code === "ELOOP") return null;
    throw error;
  }
}

router.get("/:filename", requireSessionAuth, async (req, res) => {
  const { filename } = req.params;
  const contentType = pictureTypes.get(path.extname(filename).toLowerCase());
  if (!contentType || filename.startsWith(".") || invalidFilenameCharacters.test(filename)) {
    res.status(400).json({ message: "Invalid picture filename or unsupported image format." });
    return;
  }

  const sharePath = process.env.LIS_SHARE_PATH?.trim() || "/mnt/lis-share";
  const picturesPath = path.resolve(sharePath, "Pictures");

  try {
    if (!(await lstat(picturesPath)).isDirectory()) {
      res.status(503).json({ message: "Picture storage is unavailable." });
      return;
    }

    const picture = await openPicture(path.join(picturesPath, filename));
    if (!picture) {
      res.status(404).json({ message: "Picture not found." });
      return;
    }

    try {
      if (!(await picture.stat()).isFile()) {
        res.status(404).json({ message: "Picture not found." });
        return;
      }

      res.set({
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      });

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      await pipeline(picture.createReadStream({ autoClose: false }), res);
    } finally {
      await picture.close();
    }
  } catch {
    if (!res.headersSent && !res.destroyed) {
      res.status(503).json({ message: "Picture storage is unavailable." });
    }
  }
});

export default router;
