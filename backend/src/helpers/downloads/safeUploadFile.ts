import fs from "fs";
import path from "path";
import { parseValidFilename } from "./fileDownloadHelpers";

export function resolveSafeUploadFile(
  uploadDir: string,
  filename: string
): string | null {
  if (!parseValidFilename(filename)) {
    return null;
  }

  try {
    const realUploadDir = fs.realpathSync(uploadDir);
    const requestedFile = path.resolve(realUploadDir, filename);
    const realFile = fs.realpathSync(requestedFile);
    const relativePath = path.relative(realUploadDir, realFile);

    if (
      !relativePath ||
      relativePath.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativePath) ||
      !fs.statSync(realFile).isFile()
    ) {
      return null;
    }

    return realFile;
  } catch {
    return null;
  }
}
