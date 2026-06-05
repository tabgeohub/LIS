import { Response } from "express";
import { escapeHtml } from "./escapeHtml";

export function sendHtml(res: Response, html: string): void {
  res.type("html").send(html);
}

export function renderExpiredDownloadPage(): string {
  return `<!DOCTYPE html>
<html lang="nl">
  <head><meta charset="utf-8" /><title>Beveiligde download</title></head>
  <body style="font-family: sans-serif; padding: 20px;">
    <h2>Beveiligde download</h2>
    <p style="color: red;">❌ Deze downloadlink is verlopen (ouder dan 7 dagen)</p>
  </body>
</html>`;
}

export function renderDownloadPage(options: {
  actionPath: string;
  message?: string;
  showNoPasswordNote?: boolean;
}): string {
  const action = escapeHtml(options.actionPath);
  const message = options.message
    ? `<p style="color: red;">${escapeHtml(options.message)}</p>`
    : "";
  const note = options.showNoPasswordNote
    ? `<p style="color:#666">⚠️ Er is nog geen wachtwoord ingesteld voor dit bestand.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="nl">
  <head><meta charset="utf-8" /><title>Beveiligde download</title></head>
  <body style="font-family: sans-serif; padding: 20px;">
    <h2>Beveiligde download</h2>
    ${note}
    ${message}
    <form method="POST" action="${action}">
      <input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />
      <button type="submit">Download</button>
    </form>
  </body>
</html>`;
}

export function renderWrongPasswordPage(actionPath: string): string {
  const action = escapeHtml(actionPath);

  return `<!DOCTYPE html>
<html lang="nl">
  <head><meta charset="utf-8" /><title>Beveiligde download</title></head>
  <body style="font-family: sans-serif; padding: 20px;">
    <h2>Beveiligde download</h2>
    <form method="POST" action="${action}">
      <input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />
      <button type="submit">Download</button>
    </form>
    <p style="color: red; margin-top: 10px;">❌ Ongeldig wachtwoord, probeer opnieuw</p>
  </body>
</html>`;
}
