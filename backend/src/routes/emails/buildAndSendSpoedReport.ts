import { randomUUID } from "crypto";
import dayjs from "dayjs";
import "dayjs/locale/nl";
import type { Request, Response } from "express";
import {
  buildAndMailSpoedArtifacts,
  respondSpoedReportError,
} from "./spoedReportSendHelpers";
import { validateSpoedReportRequest } from "./validateSpoedReportRequest";

dayjs.locale("nl");

export async function buildAndSendSpoedReport(input: {
  req: Request;
  res: Response;
}): Promise<void> {
  const requestId = randomUUID();

  try {
    const validation = validateSpoedReportRequest(input.req);
    if (!validation.ok) {
      input.res.status(validation.status).json({ error: validation.error });
      return;
    }

    const result = await buildAndMailSpoedArtifacts(validation);
    if (!result.ok) {
      input.res.status(result.status).json({ error: result.error });
      return;
    }

    input.res.status(200).json({ message: "Email sent!" });
  } catch (err: unknown) {
    respondSpoedReportError({
      res: input.res,
      err,
      requestId,
    });
  }
}
