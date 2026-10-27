import express from "express";
import path from "path";
import { parseValidFilename } from "../helpers/downloads/fileDownloadHelpers";
import { resolveSafeUploadFile } from "../helpers/downloads/safeUploadFile";

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");

router.get("/:filename", (req, res) => {
  const filename = parseValidFilename(req.params.filename || "");
  if (!filename) {
    return res.status(400).send("Invalid filename");
  }

  const filePath = resolveSafeUploadFile(uploadDir, filename);
  if (!filePath) {
    return res.status(404).send("File not found");
  }

  res.download(filePath, filename);
});

export default router;
