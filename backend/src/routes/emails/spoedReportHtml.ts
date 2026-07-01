import { escapeHtml } from "../../helpers/html/escapeHtml";
import {
  htmlDiv,
  htmlDocument,
  htmlEscaped,
  htmlImgSrc,
  htmlLabeledValue,
  htmlParagraph,
} from "../../helpers/html/buildHtml";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type SpoedReportFields = {
  flightNumber: string;
  regioId: string;
  omschrijving: string;
  waarnemer: string;
  vertrouwelijkLabel: string;
  longitude: string;
  latitude: string;
  when: string;
};

export function escapeSpoedReportFields(
  body: Record<string, string>,
  when: string
): SpoedReportFields {
  return {
    flightNumber: escapeHtml(body.flightNumber),
    regioId: escapeHtml(body.regio_id),
    omschrijving: escapeHtml(body.omschrijving),
    waarnemer: escapeHtml(body.waarnemer ?? ""),
    vertrouwelijkLabel: escapeHtml(body.vertrouwelijk === "1" ? "Ja" : "Nee"),
    longitude: escapeHtml(Number(body.longitude).toFixed(4)),
    latitude: escapeHtml(Number(body.latitude).toFixed(4)),
    when: escapeHtml(when),
  };
}

function encodeImageDataUrl(file: Express.Multer.File): string | null {
  const mime = file.mimetype?.toLowerCase();
  if (!mime || !ALLOWED_IMAGE_TYPES.has(mime)) return null;
  return "data:" + mime + ";base64," + file.buffer.toString("base64");
}

export function buildImageTagsFromFiles(files: Express.Multer.File[]): string {
  const parts: string[] = [];
  for (const file of files) {
    const src = encodeImageDataUrl(file);
    if (src) {
      parts.push(htmlImgSrc(htmlEscaped(src)));
    }
  }
  return parts.join("");
}

export function buildSpoedEmailHtml(fields: SpoedReportFields): string {
  return htmlParagraph(
    "Deze mail bevat informatie over een incident tijdens vluchtnummer " +
      fields.flightNumber +
      ". Open de bijlage voor meer informatie."
  );
}

const PDF_HEAD_STYLES =
  "<style>" +
  "body { font-family: Arial, sans-serif; color:#222; margin:40px; font-size:15px; }" +
  "h3 { margin-top:30px; font-size:18px; }" +
  "p { margin:6px 0; }" +
  ".section { page-break-before: always; }" +
  ".img-block { margin-top:20px; }" +
  ".img-block img { width:100%; border:2px solid black; margin-bottom:12px; }" +
  "</style>";

export function buildSpoedPdfHtml(
  fields: SpoedReportFields,
  screenshotTags: string,
  imageTags: string
): string {
  const body =
    "<h3>Waarneming</h3>" +
    htmlLabeledValue("Vlucht:", fields.flightNumber) +
    htmlLabeledValue("Regio:", fields.regioId) +
    htmlLabeledValue("Omschrijving:", fields.omschrijving) +
    htmlLabeledValue("Datum:", fields.when) +
    htmlLabeledValue("Waarnemer:", fields.waarnemer) +
    htmlLabeledValue("Vertrouwelijk:", fields.vertrouwelijkLabel) +
    htmlLabeledValue(
      "Locatie (WGS84):",
      fields.longitude + ", " + fields.latitude
    ) +
    "<h3>Aanvullende info</h3>" +
    htmlDiv("img-block", screenshotTags) +
    '<div class="section">' +
    '<h3 style="margin-top:20px;">Waarneming</h3>' +
    htmlDiv("img-block", imageTags) +
    "</div>";

  return htmlDocument(body, PDF_HEAD_STYLES);
}
