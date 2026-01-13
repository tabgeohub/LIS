import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads");

// @ts-ignore
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath, filename);
});

export default router;
