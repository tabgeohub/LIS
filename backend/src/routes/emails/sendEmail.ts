import { RequestHandler } from "express";
import puppeteer, { Page } from "puppeteer";
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import "dayjs/locale/nl";
import { buildErrorPayload } from "../../helpers/buildErrorPayload";
import { escapeHtml } from "../../helpers/escapeHtml";

dayjs.locale("nl");

const MAIL_SERVER = "relay-1.rws.nl";
const MAIL_PORT = Number(25);
const MAIL_SENDER = "no-reply@rws.nl";
const REQUIRE_TLS = String("true") === "true";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const transporter = nodemailer.createTransport({
  host: MAIL_SERVER,
  port: MAIL_PORT,
  secure: false,
  requireTLS: REQUIRE_TLS,
  tls: {},
});

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, "");
}

function encodeImageDataUrl(file: Express.Multer.File): string | null {
  const mime = file.mimetype?.toLowerCase();
  if (!mime || !ALLOWED_IMAGE_TYPES.has(mime)) return null;
  return `data:${mime};base64,${file.buffer.toString("base64")}`;
}

function imageTag(file: Express.Multer.File): string {
  const src = encodeImageDataUrl(file);
  if (!src) return "";
  return `<div><img src="${escapeHtml(src)}" alt=""/></div>`;
}

function buildImageTags(files: Express.Multer.File[]): string {
  return files.map(imageTag).join("");
}

function isAllowedPuppeteerRequest(url: string): boolean {
  return (
    url.startsWith("data:") ||
    url === "about:blank" ||
    url.startsWith("about:srcdoc")
  );
}

async function blockExternalPuppeteerRequests(page: Page): Promise<void> {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (isAllowedPuppeteerRequest(request.url())) {
      request.continue();
      return;
    }
    request.abort();
  });
}

export const sendEmail: RequestHandler = async (req, res) => {
  const requestId = randomUUID();

  try {
    const {
      senderName,
      senderEmail,
      flightNumber,
      omschrijving,
      regio_id,
      sendToEmail,
      waarnemer,
      vertrouwelijk,
      longitude,
      latitude,
    } = req.body as Record<string, string>;

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

    const safeFlightNumber = escapeHtml(flightNumber);
    const safeRegioId = escapeHtml(regio_id);
    const safeOmschrijving = escapeHtml(omschrijving);
    const safeWaarnemer = escapeHtml(waarnemer ?? "");
    const safeVertrouwelijk = escapeHtml(
      vertrouwelijk === "1" ? "Ja" : "Nee"
    );
    const safeLongitude = escapeHtml(Number(longitude).toFixed(4));
    const safeLatitude = escapeHtml(Number(latitude).toFixed(4));
    const when = escapeHtml(dayjs().format("dddd D MMMM YYYY HH:mm"));
    const screenshotTags = buildImageTags(screenshots);
    const imageTags = buildImageTags(images);

    if (!imageTags) {
      res.status(400).json({
        error: "No supported image files uploaded (jpeg, png, webp, gif)",
      });
      return;
    }

    const emailHtml = `
      <p>
        Deze mail bevat informatie over een incident tijdens vluchtnummer ${safeFlightNumber}.
        Open de bijlage voor meer informatie.
      </p>
    `;

    const pdfHtml = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; color:#222; margin:40px; font-size:15px; }
            h3 { margin-top:30px; font-size:18px; }
            p { margin:6px 0; }
            .section { page-break-before: always; }
            .img-block { margin-top:20px; }
            .img-block img { width:100%; border:2px solid black; margin-bottom:12px; }
          </style>
        </head>
        <body>
          <h3>Waarneming</h3>
          <p><strong>Vlucht:</strong> ${safeFlightNumber}</p>
          <p><strong>Regio:</strong> ${safeRegioId}</p>
          <p><strong>Omschrijving:</strong> ${safeOmschrijving}</p>
          <p><strong>Datum:</strong> ${when}</p>
          <p><strong>Waarnemer:</strong> ${safeWaarnemer}</p>
          <p><strong>Vertrouwelijk:</strong> ${safeVertrouwelijk}</p>
          <p><strong>Locatie (WGS84):</strong> ${safeLongitude}, ${safeLatitude}</p>

          <h3>Aanvullende info</h3>
          <div class="img-block">
            ${screenshotTags}
          </div>

          <div class="section">
            <h3 style="margin-top:20px;">Waarneming</h3>
            <div class="img-block">
              ${imageTags}
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        (puppeteer as any).executablePath?.(),
      dumpio: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    });

    let pdfBuffer: Buffer;
    try {
      const page = await browser.newPage();
      await blockExternalPuppeteerRequests(page);
      await page.setContent(pdfHtml, {
        waitUntil: "domcontentloaded",
      });
      await page.emulateMediaType("screen");

      await page.evaluate(async () => {
        const d = (globalThis as any).document;
        const list = Array.from((d?.images ?? []) as any[]);
        await Promise.all(
          list.map((img: any) => {
            if (typeof img?.decode === "function")
              return img.decode().catch(() => {});
            if (img?.complete) return Promise.resolve();
            return new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            });
          })
        );
        const fontsReady = (d as any)?.fonts?.ready;
        if (fontsReady && typeof fontsReady.then === "function")
          await fontsReady;
      });

      const bytes = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
      });
      pdfBuffer = Buffer.from(bytes);
    } finally {
      await browser.close();
    }

    // @ts-ignore
    const attachments: nodemailer.Attachment[] = [
      {
        filename: "spoedrapport.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];

    await transporter.sendMail({
      from: `${sanitizeHeaderValue(senderName)} <${MAIL_SENDER}>`,
      replyTo: senderEmail,
      to: recipients,
      subject: `Waarneming tijdens vluchtnummer ${sanitizeHeaderValue(flightNumber)}`,
      html: emailHtml,
      attachments,
    });

    res.status(200).json({ message: "Email sent!" });
    return;
  } catch (err: any) {
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
    return;
  }
};
