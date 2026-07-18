import dayjs from "dayjs";
import type { Response } from "express";
import { buildErrorPayload } from "../../helpers/http/buildErrorPayload";
import {
  buildImageTagsFromFiles,
  buildSpoedEmailHtml,
  buildSpoedPdfHtml,
  escapeSpoedReportFields,
} from "./spoedReportHtml";
import { sendSpoedReportMail } from "./spoedReportMail";
import { renderHtmlToPdfBuffer } from "./spoedReportPdf";
import type { SpoedReportValidation } from "./validateSpoedReportRequest";

const SMTP_NETWORK_ERROR =
  /ETIMEDOUT|ECONNREFUSED|ENETUNREACH|ECONNRESET|EHOSTUNREACH/i;

type ValidatedSpoed = Extract<SpoedReportValidation, { ok: true }>;

export type SpoedSendResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function renderSpoedPdfBuffer(
  validation: ValidatedSpoed
): Promise<SpoedSendResult & { pdfBuffer?: Buffer; emailHtml?: string }> {
  const { body, images, screenshots } = validation;
  const fields = escapeSpoedReportFields(
    body,
    dayjs().format("dddd D MMMM YYYY HH:mm")
  );
  const imageTags = buildImageTagsFromFiles(images);
  if (!imageTags) {
    return {
      ok: false,
      status: 400,
      error: "No supported image files uploaded (jpeg, png, webp, gif)",
    };
  }
  const pdfBuffer = await renderHtmlToPdfBuffer(
    buildSpoedPdfHtml({
      fields,
      screenshotTags: buildImageTagsFromFiles(screenshots),
      imageTags,
    })
  );
  return { ok: true, pdfBuffer, emailHtml: buildSpoedEmailHtml(fields) };
}

export async function buildAndMailSpoedArtifacts(
  validation: ValidatedSpoed
): Promise<SpoedSendResult> {
  const rendered = await renderSpoedPdfBuffer(validation);
  if (!rendered.ok || !rendered.pdfBuffer || !rendered.emailHtml) {
    return rendered;
  }
  const { body, recipients } = validation;
  await sendSpoedReportMail({
    senderName: body.senderName,
    senderEmail: body.senderEmail,
    flightNumber: body.flightNumber,
    recipients,
    html: rendered.emailHtml,
    pdfBuffer: rendered.pdfBuffer,
  });
  return { ok: true };
}

export function respondSpoedReportError(
  res: Response,
  err: unknown,
  requestId: string
): void {
  const payload = buildErrorPayload(err, requestId);
  if (SMTP_NETWORK_ERROR.test(payload.code || "")) {
    // @ts-ignore
    payload.hint =
      "SMTP relay unreachable. Check outbound firewall/egress, proxy, DNS, or relay allow-lists.";
  }
  console.error("[/emails/sendEmail] Error", { requestId, err });
  const status = SMTP_NETWORK_ERROR.test(payload.code || "") ? 502 : 500;
  res.status(status).json({ error: payload });
}
