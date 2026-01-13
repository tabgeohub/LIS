import express, { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { setPassword, hasPassword, verifyPassword } from "./passwordStore";

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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --- NEW: set password for a specific file
// body: { password: string }
const setPasswordHandler: RequestHandler<
  { filename: string },
  any,
  { password: string }
> = (req, res) => {
  const filename = String(req.params.filename || "");

  if (!FILE_RE.test(filename)) {
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
  res.status(204).end(); // no content
};

router.post("/:filename/password", express.json(), setPasswordHandler);

// Show password page
// @ts-ignore
router.get("/:filename", (req, res) => {
  const filename = String(req.params.filename || "");

  if (!FILE_RE.test(filename)) {
    return res.status(400).send("❌ Ongeldige bestandsnaam");
  }

  if (isExpiredFromName(filename)) {
    return res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Beveiligde download</h2>
          <p style="color: red;">❌ Deze downloadlink is verlopen (ouder dan 7 dagen)</p>
        </body>
      </html>
    `);
  }

  const safeAction = `/api/file-download/${encodeURIComponent(filename)}`;
  const note = hasPassword(filename)
    ? ""
    : `<p style="color:#666">⚠️ Er is nog geen wachtwoord ingesteld voor dit bestand.</p>`;

  res.send(`
    <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>Beveiligde download</h2>
        ${note}
        <form method="POST" action="${escapeHtml(safeAction)}">
          <input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />
          <button type="submit">Download</button>
        </form>
      </body>
    </html>
  `);
});

const downloadWithPasswordHandler: RequestHandler<
  { filename: string },
  any,
  { password: string }
> = (req, res) => {
  const filename = String(req.params.filename || "");
  const password = String(req.body?.password || "");

  if (!FILE_RE.test(filename)) {
    res.status(400).send("❌ Ongeldige bestandsnaam");
    return;
  }

  if (isExpiredFromName(filename)) {
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Beveiligde download</h2>
          <p style="color: red;">❌ Deze downloadlink is verlopen (ouder dan 7 dagen)</p>
        </body>
      </html>
    `);
    return;
  }

  if (!hasPassword(filename)) {
    const safeAction = `/api/file-download/${encodeURIComponent(filename)}`;
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Beveiligde download</h2>
          <p style="color: red;">❌ Geen wachtwoord ingesteld voor dit bestand.</p>
          <form method="POST" action="${escapeHtml(safeAction)}">
            <input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />
            <button type="submit">Download</button>
          </form>
        </body>
      </html>
    `);
    return;
  }

  if (!verifyPassword(filename, password)) {
    const safeAction = `/api/file-download/${encodeURIComponent(filename)}`;
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h2>Beveiligde download</h2>
          <form method="POST" action="${escapeHtml(safeAction)}">
            <input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />
            <button type="submit">Download</button>
          </form>
          <p style="color: red; margin-top: 10px;">❌ Ongeldig wachtwoord, probeer opnieuw</p>
        </body>
      </html>
    `);
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
