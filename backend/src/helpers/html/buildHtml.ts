import { escapeHtml } from "./escapeHtml";

export function htmlEscaped(value: unknown): string {
  return escapeHtml(value);
}

export function htmlParagraph(innerHtml: string): string {
  return "<p>" + innerHtml + "</p>";
}

export function htmlLabeledValue(label: string, escapedValue: string): string {
  return "<p><strong>" + label + "</strong> " + escapedValue + "</p>";
}

export function htmlDiv(className: string, innerHtml: string): string {
  return '<div class="' + className + '">' + innerHtml + "</div>";
}

export function htmlImgSrc(escapedSrc: string): string {
  return '<div><img src="' + escapedSrc + '" alt=""/></div>';
}

export function htmlDocument(bodyHtml: string, headExtra = ""): string {
  return (
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\" />" +
    headExtra +
    "</head><body>" +
    bodyHtml +
    "</body></html>"
  );
}

export function htmlFormPost(actionPath: string, bodyHtml: string): string {
  const action = htmlEscaped(actionPath);
  return (
    '<form method="POST" action="' +
    action +
    '">' +
    bodyHtml +
    "</form>"
  );
}
