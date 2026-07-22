import express, { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { setPassword, hasPassword } from "./passwordStore";
import { requireSessionAuth } from "../helpers/auth/requireSessionAuth";
import {
  renderDownloadPage,
  renderExpiredDownloadPage,
  sendHtml,
} from "../helpers/html/renderDownloadPage";
import {
  buildDownloadActionPath,
  resolveDownloadFilename,
} from "../helpers/downloads/fileDownloadHelpers";
import {
  resolvePasswordDownloadFilename,
  sendPasswordGateFailure,
  sendVerifiedDownload,
  uploadDir,
} from "./fileDownloadHelpers";

dotenv.config();

const router = express.Router();

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
  const filename = resolvePasswordDownloadFilename(req, res);
  if (!filename) return;
  if (sendPasswordGateFailure({ res, filename, password })) return;
  sendVerifiedDownload({ res, filename });
};

router.post(
  "/:filename",
  express.urlencoded({ extended: true }),
  downloadWithPasswordHandler
);

export default router;
