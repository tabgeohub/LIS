import type { Request, Response } from "express";

export type ResolveDownloadFilenameInput = {
  req: Request;
  res: Response;
  onExpired: (res: Response) => void;
};

export function resolveDownloadFilename(
  input: ResolveDownloadFilenameInput
): string | null {
  const { req, res, onExpired } = input;
  const filename = parseValidFilename(req.params.filename || "");

  if (!filename) {
    res.status(400).send("❌ Ongeldige bestandsnaam");
    return null;
  }

  if (isExpiredFromName(filename)) {
    onExpired(res);
    return null;
  }

  return filename;
}

export function parseValidFilename(raw: string): string | null {
  const filename = String(raw || "");
  return FILE_RE.test(filename) ? filename : null;
}

export function isExpiredFromName(name: string): boolean {
  const ts = Number(name.split("-")[0]);
  if (!Number.isFinite(ts)) return true;
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - ts > sevenDays;
}

export function buildDownloadActionPath(filename: string): string {
  return `/api/file-download/${encodeURIComponent(filename)}`;
}

const FILE_RE = /^\d{10,13}-[0-9a-fA-F-]{36}\.zip$/;
