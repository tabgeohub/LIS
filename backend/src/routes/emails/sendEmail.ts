import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import "dayjs/locale/nl";
import { buildErrorPayload } from "../../helpers/http/buildErrorPayload";
import {
  buildImageTagsFromFiles,
  buildSpoedEmailHtml,
  buildSpoedPdfHtml,
  escapeSpoedReportFields,
} from "./spoedReportHtml";
import { sendSpoedReportMail } from "./spoedReportMail";
import { renderHtmlToPdfBuffer } from "./spoedReportPdf";
import { validateSpoedReportRequest } from "./validateSpoedReportRequest";

dayjs.locale("nl");

const SMTP_NETWORK_ERROR =
  /ETIMEDOUT|ECONNREFUSED|ENETUNREACH|ECONNRESET|EHOSTUNREACH/i;

export const sendEmail: RequestHandler = async (req, res) => {
  const requestId = randomUUID();

  try {
    const validation = validateSpoedReportRequest(req);
    if (!validation.ok) {
      res.status(validation.status).json({ error: validation.error });
      return;
    }

    const { body, recipients, images, screenshots } = validation;
    const { senderName, senderEmail, flightNumber } = body;

    const fields = escapeSpoedReportFields(
      body,
      dayjs().format("dddd D MMMM YYYY HH:mm")
    );
    const screenshotTags = buildImageTagsFromFiles(screenshots);
    const imageTags = buildImageTagsFromFiles(images);

    if (!imageTags) {
      res.status(400).json({
        error: "No supported image files uploaded (jpeg, png, webp, gif)",
      });
      return;
    }

    const emailHtml = buildSpoedEmailHtml(fields);
    const pdfHtml = buildSpoedPdfHtml(fields, screenshotTags, imageTags);
    const pdfBuffer = await renderHtmlToPdfBuffer(pdfHtml);

    await sendSpoedReportMail({
      senderName,
      senderEmail,
      flightNumber,
      recipients,
      html: emailHtml,
      pdfBuffer,
    });

    res.status(200).json({ message: "Email sent!" });
  } catch (err: unknown) {
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
};
