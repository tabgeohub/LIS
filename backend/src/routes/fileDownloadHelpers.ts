import type { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import { hasPassword, verifyPassword } from "./passwordStore";
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

const uploadDir = path.join(__dirname, "..", "uploads");

export function resolvePasswordDownloadFilename(
  req: Parameters<RequestHandler<{ filename: string }>>[0],
  res: Parameters<RequestHandler<{ filename: string }>>[1]
): string | null {
  return resolveDownloadFilename({
    req,
    res,
    onExpired: (response) => {
      sendHtml(response, renderExpiredDownloadPage());
    },
  });
}

export function sendPasswordGateFailure(input: {
  res: Parameters<RequestHandler>[1];
  filename: string;
  password: string;
}): boolean {
  const { res, filename, password } = input;
  const actionPath = buildDownloadActionPath(filename);

  if (!hasPassword(filename)) {
    sendHtml(
      res,
      renderDownloadPage({
        actionPath,
        message: "❌ Geen wachtwoord ingesteld voor dit bestand.",
      })
    );
    return true;
  }

  if (!verifyPassword(filename, password)) {
    sendHtml(res, renderWrongPasswordPage(actionPath));
    return true;
  }

  return false;
}

export function sendVerifiedDownload(input: {
  res: Parameters<RequestHandler>[1];
  filename: string;
}): void {
  const { res, filename } = input;
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).send("❌ Bestand niet gevonden");
    return;
  }
  res.download(filePath, filename);
}

export { uploadDir };
