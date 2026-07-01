import express, { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { setPassword, hasPassword, verifyPassword } from "./passwordStore";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";
import {
  renderDownloadPage,
  renderExpiredDownloadPage,
  renderWrongPasswordPage,
  sendHtml,
} from "../helpers/html/renderDownloadPage";
import {
  buildDownloadActionPath,
  resolveDownloadFilename,
} from "../helpers/downloads/fileDownloadHelpers";

dotenv.config();

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");

const setPasswordHandler: RequestHandler<
  { filename: string },
  any,
  { password: string }
> = (req, res) => {
  const filename = resolveDownloadFilename({
    req,
    res,
    onExpired: () => {
      res.status(410).send("❌ Link verlopen");
    },
  });

  if (!filename) {
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
  const filename = resolveDownloadFilename({
    req,
    res,
    onExpired: (response) => {
      sendHtml(response, renderExpiredDownloadPage());
    },
  });

  if (!filename) {
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
  const password = String(req.body?.password || "");
  const filename = resolveDownloadFilename({
    req,
    res,
    onExpired: (response) => {
      sendHtml(response, renderExpiredDownloadPage());
    },
  });

  if (!filename) {
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
