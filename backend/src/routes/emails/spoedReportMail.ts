import nodemailer from "nodemailer";

const MAIL_SERVER = "relay-1.rws.nl";
const MAIL_PORT = Number(25);
const MAIL_SENDER = "no-reply@rws.nl";
const REQUIRE_TLS = String("true") === "true";

const transporter = nodemailer.createTransport({
  host: MAIL_SERVER,
  port: MAIL_PORT,
  secure: false,
  requireTLS: REQUIRE_TLS,
  tls: {},
});

export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]/g, "");
}

export type SpoedMailPayload = {
  senderName: string;
  senderEmail: string;
  flightNumber: string;
  recipients: string[];
  html: string;
  pdfBuffer: Buffer;
};

export async function sendSpoedReportMail(
  payload: SpoedMailPayload
): Promise<void> {
  await transporter.sendMail({
    from:
      sanitizeHeaderValue(payload.senderName) + " <" + MAIL_SENDER + ">",
    replyTo: payload.senderEmail,
    to: payload.recipients,
    subject:
      "Waarneming tijdens vluchtnummer " +
      sanitizeHeaderValue(payload.flightNumber),
    html: payload.html,
    attachments: [
      {
        filename: "spoedrapport.pdf",
        content: payload.pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
