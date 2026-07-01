import { Response } from "express";
import {
  htmlDocument,
  htmlEscaped,
  htmlFormPost,
  htmlParagraph,
} from "./buildHtml";

export function sendHtml(res: Response, html: string): void {
  res.type("html").send(html);
}

export function renderExpiredDownloadPage(): string {
  return htmlDocument(
    "<h2>Beveiligde download</h2>" +
      '<p style="color: red;">❌ Deze downloadlink is verlopen (ouder dan 7 dagen)</p>',
    '<title>Beveiligde download</title>'
  );
}

export function renderDownloadPage(options: {
  actionPath: string;
  message?: string;
  showNoPasswordNote?: boolean;
}): string {
  const message = options.message
    ? htmlParagraph('<span style="color: red;">' + htmlEscaped(options.message) + "</span>")
    : "";
  const note = options.showNoPasswordNote
    ? htmlParagraph('<span style="color:#666">⚠️ Er is nog geen wachtwoord ingesteld voor dit bestand.</span>')
    : "";
  const formBody =
    '<input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />' +
    '<button type="submit">Download</button>';

  const body =
    "<h2>Beveiligde download</h2>" +
    note +
    message +
    htmlFormPost(options.actionPath, formBody);

  return htmlDocument(body, '<title>Beveiligde download</title>');
}

export function renderWrongPasswordPage(actionPath: string): string {
  const formBody =
    '<input type="password" name="password" placeholder="Voer wachtwoord in" autofocus />' +
    '<button type="submit">Download</button>';
  const body =
    "<h2>Beveiligde download</h2>" +
    htmlFormPost(actionPath, formBody) +
    '<p style="color: red; margin-top: 10px;">❌ Ongeldig wachtwoord, probeer opnieuw</p>';

  return htmlDocument(body, '<title>Beveiligde download</title>');
}
