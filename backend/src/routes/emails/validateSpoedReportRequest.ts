type SpoedReportBody = Record<string, string>;

export type SpoedReportValidation =
  | { ok: false; status: number; error: string }
  | {
      ok: true;
      body: SpoedReportBody;
      recipients: string[];
      images: Express.Multer.File[];
      screenshots: Express.Multer.File[];
    };

export function validateSpoedReportRequest(req: {
  body: SpoedReportBody;
  files?: Record<string, Express.Multer.File[]> | Express.Multer.File[];
}): SpoedReportValidation {
  const body = req.body;
  const { senderName, senderEmail, flightNumber, omschrijving, regio_id, sendToEmail } =
    body;

  if (!senderName || !senderEmail) {
    return { ok: false, status: 400, error: "Missing senderName or senderEmail" };
  }
  if (!flightNumber || !omschrijving || !regio_id) {
    return {
      ok: false,
      status: 400,
      error: "Missing flightNumber, omschrijving or regio_id",
    };
  }

  const recipients = (sendToEmail || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (recipients.length === 0) {
    return { ok: false, status: 400, error: "No recipients provided in sendToEmail" };
  }

  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const images = files?.images ?? [];
  const screenshots = files?.screenshots ?? [];

  if (images.length === 0) {
    return { ok: false, status: 400, error: "No images uploaded" };
  }

  return { ok: true, body, recipients, images, screenshots };
}
