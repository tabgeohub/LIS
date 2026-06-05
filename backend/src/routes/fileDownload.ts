import express, { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { setPassword, hasPassword, verifyPassword } from "./passwordStore";
import { requireSessionAuth } from "../helpers/requireSessionAuth";
import {
  renderDownloadPage,
  renderExpiredDownloadPage,
  renderWrongPasswordPage,
  sendHtml,
} from "../helpers/renderDownloadPage";

dotenv.config();

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");

// strict filename: "<timestamp>-<uuid>.zip"
const FILE_RE = /^\d{10,13}-[0-9a-fA-F-]{36}\.zip$/;

function isExpiredFromName(name: string): boolean {
  const ts = Number(name.split("-")[0]);
  if (!Number.isFinite(ts)) return true;
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - ts > sevenDays;
}

function parseValidFilename(raw: string): string | null {
  const filename = String(raw || "");
  return FILE_RE.test(filename) ? filename : null;
}

function buildDownloadActionPath(filename: string): string {
  return `/api/file-download/${encodeURIComponent(filename)}`;
}

const setPasswordHandler: RequestHandler<
  { filename: string },
  any,
  { password: string }
> = (req, res) => {
  const filename = parseValidFilename(req.params.filename || "");

  if (!filename) {
    res.status(400).send("❌ Ongeldige bestandsnaam");
    return;
  }
  if (isExpiredFromName(filename)) {
    res.status(410).send("❌ Link verlopen");
    return;
  }

  const password = String(req.body?.password || "").trim();
  if (!password) {
    res.status(400).send("❌ Wachtwoord is verplicht");
    return;
  }

  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).send("❌ Bestand niet gevonden");
    return;
  }

  setPassword(filename, password);
  res.status(204).end();
};

router.post(
  "/:filename/password",
  requireSessionAuth,
  express.json(),
  setPasswordHandler
);

router.get("/:filename", (req, res) => {
  const filename = parseValidFilename(req.params.filename || "");

  if (!filename) {
    res.status(400).send("❌ Ongeldige bestandsnaam");
    return;
  }

  if (isExpiredFromName(filename)) {
    sendHtml(res, renderExpiredDownloadPage());
    return;
  }

  sendHtml(
    res,
    renderDownloadPage({
      actionPath: buildDownloadActionPath(filename),
      showNoPasswordNote: !hasPassword(filename),
    })
  );
});

const downloadWithPasswordHandler: RequestHandler<
  { filename: string },
  any,
  { password: string }
> = (req, res) => {
  const filename = parseValidFilename(req.params.filename || "");
  const password = String(req.body?.password || "");

  if (!filename) {
    res.status(400).send("❌ Ongeldige bestandsnaam");
    return;
  }

  if (isExpiredFromName(filename)) {
    sendHtml(res, renderExpiredDownloadPage());
    return;
  }

  const actionPath = buildDownloadActionPath(filename);

  if (!hasPassword(filename)) {
    sendHtml(
      res,
      renderDownloadPage({
        actionPath,
        message: "❌ Geen wachtwoord ingesteld voor dit bestand.",
      })
    );
    return;
  }

  if (!verifyPassword(filename, password)) {
    sendHtml(res, renderWrongPasswordPage(actionPath));
    return;
  }

  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).send("❌ Bestand niet gevonden");
    return;
  }

  res.download(filePath, filename);
};

router.post(
  "/:filename",
  express.urlencoded({ extended: true }),
  downloadWithPasswordHandler
);

export default router;
