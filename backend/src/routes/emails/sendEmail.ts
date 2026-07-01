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

dayjs.locale("nl");

export const sendEmail: RequestHandler = async (req, res) => {
  const requestId = randomUUID();

  try {
    const body = req.body as Record<string, string>;
    const {
      senderName,
      senderEmail,
      flightNumber,
      omschrijving,
      regio_id,
      sendToEmail,
    } = body;

    if (!senderName || !senderEmail) {
      res.status(400).json({ error: "Missing senderName or senderEmail" });
      return;
    }
    if (!flightNumber || !omschrijving || !regio_id) {
      res
        .status(400)
        .json({ error: "Missing flightNumber, omschrijving or regio_id" });
      return;
    }

    const recipients = (sendToEmail || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (recipients.length === 0) {
      res.status(400).json({ error: "No recipients provided in sendToEmail" });
      return;
    }

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;
    const images = files?.images ?? [];
    const screenshots = files?.screenshots ?? [];

    if (images.length === 0) {
      res.status(400).json({ error: "No images uploaded" });
      return;
    }

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

    if (
      /ETIMEDOUT|ECONNREFUSED|ENETUNREACH|ECONNRESET|EHOSTUNREACH/i.test(
        payload.code || ""
      )
    ) {
      // @ts-ignore
      payload.hint =
        "SMTP relay unreachable. Check outbound firewall/egress, proxy, DNS, or relay allow-lists.";
    }

    console.error("[/emails/sendEmail] Error", { requestId, err });
    const status =
      /ETIMEDOUT|ECONNREFUSED|ENETUNREACH|ECONNRESET|EHOSTUNREACH/i.test(
        payload.code || ""
      )
        ? 502
        : 500;

    res.status(status).json({ error: payload });
  }
};
