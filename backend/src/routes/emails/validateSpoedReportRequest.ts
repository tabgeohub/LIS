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

function fail(error: string): SpoedReportValidation {
  return { ok: false, status: 400, error };
}

export function parseSpoedReportRecipients(sendToEmail: string | undefined): string[] {
  return (sendToEmail || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function hasSenderFields(body: SpoedReportBody): boolean {
  return Boolean(body.senderName && body.senderEmail);
}

function hasFlightFields(body: SpoedReportBody): boolean {
  return Boolean(body.flightNumber && body.omschrijving && body.regio_id);
}

export function validateSpoedReportFields(
  body: SpoedReportBody
): SpoedReportValidation | null {
  if (!hasSenderFields(body)) {
    return fail("Missing senderName or senderEmail");
  }
  if (!hasFlightFields(body)) {
    return fail("Missing flightNumber, omschrijving or regio_id");
  }

  const recipients = parseSpoedReportRecipients(body.sendToEmail);
  if (recipients.length === 0) {
    return fail("No recipients provided in sendToEmail");
  }

  return null;
}

export function validateSpoedReportRequest(req: {
  body: SpoedReportBody;
  files?: Record<string, Express.Multer.File[]> | Express.Multer.File[];
}): SpoedReportValidation {
  const body = req.body;
  const fieldError = validateSpoedReportFields(body);
  if (fieldError) return fieldError;

  const recipients = parseSpoedReportRecipients(body.sendToEmail);
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const images = files?.images ?? [];
  const screenshots = files?.screenshots ?? [];

  if (images.length === 0) {
    return fail("No images uploaded");
  }

  return { ok: true, body, recipients, images, screenshots };
}
